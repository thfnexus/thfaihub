'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface DegreeVsSkillInput {
    ageGrade: string
    country: string
    education: string
    desiredCareer: string
    currentSkills?: string
    financialUrgency: string
    additionalNotes?: string
}

export interface DegreeVsSkillResponse {
    verdict: 'Skill-heavy' | 'Degree-heavy'
    comparisonMetrics: {
        timeToROI: {
            degree: string
            skill: string
        }
        potentialEarningsGap: string
    }
    upsidesAndDownsides: {
        skillPath: string[]
        degreePath: string[]
    }
    riskFactor: string
    finalRecommendation: string
}

export async function generateDegreeVsSkillAnalysis(
    formData: DegreeVsSkillInput
): Promise<{ success: boolean; data?: DegreeVsSkillResponse; error?: string }> {
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

        const systemPrompt = `You are an expert Educational Consultant and Career Strategist for the year 2026.
Your goal is to simplify career path decisions for students and parents.
Compare a Degree-based path vs a Skill-based path with brutally honest data on ROI, Time-to-Earning, and Risks (including AI impact).
Focus on the specific country provided.
You MUST respond with ONLY valid JSON.`

        const userPrompt = `Compare Degree vs Skill for:
Age/Grade: ${formData.ageGrade}
Country: ${formData.country}
Education: ${formData.education}
Career Goal: ${formData.desiredCareer}
Current Skills: ${formData.currentSkills || 'None'}
Financial Urgency: ${formData.financialUrgency}
Notes: ${formData.additionalNotes || 'None'}

Return JSON format:
{
  "verdict": "Skill-heavy",
  "comparisonMetrics": {
    "timeToROI": {
      "degree": "10-12 Years",
      "skill": "2-3 Years"
    },
    "potentialEarningsGap": "Degrees earn 20% more in the long run but skills earn faster."
  },
  "upsidesAndDownsides": {
    "skillPath": ["Faster earning", "Practical focus"],
    "degreePath": ["Branding", "Long-term security"]
  },
  "riskFactor": "AI automation risk for junior roles is high.",
  "finalRecommendation": "Based on your financial urgency, start with skills..."
}`

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2000,
        })

        const responseText = completion.choices[0]?.message?.content
        if (!responseText) {
            return { success: false, error: "Failed to generate analysis" }
        }

        let analysisData: DegreeVsSkillResponse
        try {
            analysisData = JSON.parse(responseText)
        } catch (e) {
            return { success: false, error: "AI returned invalid format. Please try again." }
        }

        // Deduct credit
        await prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { decrement: 1 } }
        })

        // Log usage
        await prisma.usageLog.create({
            data: {
                userId: session.user.id,
                toolName: "Degree vs Skill Simulator",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/degree-vs-skill")

        return { success: true, data: analysisData }
    } catch (error: any) {
        console.error("Degree vs Skill Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
