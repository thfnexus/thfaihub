'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface SkillAnalyzerInput {
    fullName?: string
    age: string
    country: string
    education: string
    currentField: string
    currentSkills: string // Comma separated or single string
    experience: string
    futureGoal: string
    financialUrgency: string
    learningPreference: string
    additionalNotes?: string
}

export interface SkillAnalysisResponse {
    masteryLevel: number
    topSkillGaps: string[]
    roadmap12Months: {
        m1_3: string
        m4_6: string
        m7_12: string
    }
    recommendedCourses: {
        name: string
        platform: string
        duration: string
    }[]
    worthCertifications: string
}

export async function generateSkillAnalysis(
    formData: SkillAnalyzerInput
): Promise<{ success: boolean; data?: SkillAnalysisResponse; error?: string }> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" }
        }

        if ((session.user.role as any) === "SUSPENDED") {
            return { success: false, error: "Your account has been suspended. Please contact support." }
        }

        if (!(session.user as any).emailVerified) {
            return { success: false, error: "Please verify your email to use this tool." }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true }
        })

        if (!user || user.credits < 1) {
            return { success: false, error: "Insufficient credits. Please upgrade your plan." }
        }

        const systemPrompt = `You are an expert AI Skills Analyst for the year 2026. 
Analyze the user's current skills vs their future goals. 
Provide a deep, realistic analysis of skill gaps and a 12-month learning trajectory.
Focus on providing specific course recommendations and high-value certifications.
You MUST respond with ONLY valid JSON.`

        const userPrompt = `Analyze skills for:
Name: ${formData.fullName || 'User'}
Age: ${formData.age}
Country: ${formData.country}
Education: ${formData.education}
Field: ${formData.currentField}
Current Skills: ${formData.currentSkills}
Experience: ${formData.experience}
Future Goal: ${formData.futureGoal}
Financial Urgency: ${formData.financialUrgency}
Learning Preference: ${formData.learningPreference}
Notes: ${formData.additionalNotes || 'None'}

Return JSON format:
{
  "masteryLevel": 45,
  "topSkillGaps": ["React Server Components", "Prompt Engineering", "Cloud Deployment"],
  "roadmap12Months": {
    "m1_3": "Focus on...",
    "m4_6": "Transition to...",
    "m7_12": "Finalize..."
  },
  "recommendedCourses": [
    { "name": "Modern Web Development", "platform": "Coursera", "duration": "4 Weeks" }
  ],
  "worthCertifications": "AWS Certified Developer"
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
            return { success: false, error: "Failed to generate analysis" }
        }

        let analysisData: SkillAnalysisResponse
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
                toolName: "AI Skills Analyzer",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/skills-analyzer")

        return { success: true, data: analysisData }
    } catch (error: any) {
        console.error("Skill Analyzer Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
