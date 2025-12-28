'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface CareerCounselorInput {
    age: string
    country: string
    education: string
    primaryInterest: string
    workStyle: string
    workType: string
    mathLevel: string
    englishLevel: string
    financialUrgency: string
    communicationLevel: string
    additionalNotes: string
    primaryGoal: string
}

interface CareerMatchScore {
    career: string
    score: number
}

interface Roadmap {
    months1to3: string
    months4to6: string
    months7to12: string
}

interface FinalAdvice {
    startThisWeek: string
    avoid: string
    reconsiderWhen: string
}

interface CareerGuidanceResponse {
    careerMatchScores: CareerMatchScore[]
    bestPath: string
    roadmap: Roadmap
    riskWarnings: string[]
    finalAdvice: FinalAdvice
}

export async function generateCareerGuidance(
    formData: CareerCounselorInput
): Promise<{ success: boolean; data?: CareerGuidanceResponse; error?: string }> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true }
        })

        if (!user || user.credits < 1) {
            return { success: false, error: "Insufficient credits. Please upgrade your plan." }
        }

        // System prompt
        const systemPrompt = "You are a professional career counselor specializing in education and career path guidance. Focus on helping people make smart career decisions based on their education, interests, and goals. Provide honest, reality-based advice for 2026 job market. You must respond with ONLY valid JSON."

        // User prompt
        const userPrompt = `Provide realistic career counseling (NOT skills analysis) for:

Age: ${formData.age}
Country: ${formData.country}
Education: ${formData.education}
Interest: ${formData.primaryInterest}
Work Style: ${formData.workStyle}
Work Type: ${formData.workType}
Math Level: ${formData.mathLevel}
English: ${formData.englishLevel}
Financial Urgency: ${formData.financialUrgency}
Communication & Confidence: ${formData.communicationLevel}
Goal: ${formData.primaryGoal}${formData.additionalNotes ? `\nAdditional Notes/Questions: ${formData.additionalNotes}` : ''}

Focus on CAREER PATHS, whether to pursue DEGREE or SKILLS, 12-month ACTION PLAN, market WARNINGS, and NEXT STEPS.${formData.additionalNotes ? ' Address any specific questions mentioned in Additional Notes.' : ''}

Return JSON:
{
  "careerMatchScores": [{"career": "Path 1", "score": 85}, {"career": "Path 2", "score": 72}],
  "bestPath": "Degree + Skills / Only Skills / Exam / Business",
  "roadmap": {
    "months1to3": "Education/learning to start",
    "months4to6": "Intermediate + projects",
    "months7to12": "Advanced + job prep"
  },
  "riskWarnings": ["Competition warning", "AI impact", "Challenges"],
  "finalAdvice": {
   "startThisWeek": "First action",
    "avoid": "What NOT to do",
    "reconsiderWhen": "Red flags"
  }
}`

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 1500,
        })

        const responseText = completion.choices[0]?.message?.content
        if (!responseText) {
            return { success: false, error: "Failed to generate guidance" }
        }

        console.log('OpenAI Response:', responseText)

        let guidanceData: CareerGuidanceResponse
        try {
            guidanceData = JSON.parse(responseText)

            if (!guidanceData.careerMatchScores || !guidanceData.roadmap || !guidanceData.finalAdvice) {
                throw new Error('Missing required fields')
            }
        } catch (e: any) {
            console.error('Parse Error:', e.message)
            return { success: false, error: "AI returned invalid format. Please try again." }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { decrement: 1 } }
        })

        await prisma.usageLog.create({
            data: {
                userId: session.user.id,
                toolName: "AI Career Counselor",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/career-counselor")

        return { success: true, data: guidanceData }
    } catch (error: any) {
        console.error("Career Counselor Error:", error)
        return {
            success: false,
            error: error.message || "An error occurred"
        }
    }
}
