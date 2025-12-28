'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface CourseRecommenderInput {
    currentSkills: string
    targetRole: string
    budgetLimit: string
    timeCommitment: string
    platformPreference: string
    otherPlatform?: string
}

export interface RecommendedCourse {
    name: string
    hostPlatform: string
    hostUniversity?: string
    cost: string
    duration: string
    qualityScore: number // 1-10
    certificateValue: string // "High", "Medium", "Low"
    roiMetrics: {
        salaryPotential: string // e.g. "20-30% increase"
        marketDemand: "High" | "Medium" | "Low"
        valueForMoney: string
    }
    curriculumHighlights: string[]
    pros: string
    cons: string
    timeToOutcome: string // Estimated months to job-ready
    officialUrl: string
}

export async function generateCourseRecommendations(
    formData: CourseRecommenderInput
): Promise<{ success: boolean; data?: RecommendedCourse[]; error?: string }> {
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

        const systemPrompt = `You are a Senior Career Market Strategist and AI Course Auditor.
Your job is to recommend the HIGHEST VALUE courses and bootcamps (Coursera, Udemy, edX, LinkedIn Learning, or Local Bootcamps) based on REAL-WORLD ROI and 2026 market demand.

⚠️ CRITICAL AUDIT RULES:
1. ELIMINATE SPAM: Do not suggest generic "Best of" courses unless they have a verified ROI.
2. ROI DRIVEN: Every recommendation must calculate the potential salary jump or career pivot success rate.
3. QUALITY FILTER: Discard courses with outdated materials or low industry recognition.
4. HONEST ADVISORY: If a course is expensive but the certificate is worthless, state that in the "Cons".
5. LOCAL + GLOBAL: Include major global platforms but mention reputable bootcamps if they fit the ROI metric.

OUTPUT STYLE:
- Analytical, data-backed, and professional.
- No sugarcoating.
- Focus on "Time to Outcome" (how fast will they get the job?).

You MUST respond with ONLY valid JSON.`

        const userPrompt = `
USER PROFILE:
- Current Skills: ${formData.currentSkills}
- Target Role/Skill Goal: ${formData.targetRole}
- Budget Limit: ${formData.budgetLimit}
- Time Commitment: ${formData.timeCommitment}
- Platform Preference: ${formData.platformPreference === 'Other' ? formData.otherPlatform : formData.platformPreference}

TASK:
1. Suggest at least 4-6 REAL courses/programs.
2. Rank them by "Worth the Money/Time".
3. Provide metadata including Duration, Price, Certificate Value, and Outcomes.

RETURN JSON FORMAT:
{
  "recommendations": [
    {
      "name": "Course Name",
      "hostPlatform": "Coursera/Udemy/etc.",
      "hostUniversity": "Optional University Partner",
      "cost": "Price or Free",
      "duration": "Duration in hours/weeks",
      "qualityScore": 0-10,
      "certificateValue": "High/Medium/Low",
      "roiMetrics": {
        "salaryPotential": "e.g. +25% Avg Increase",
        "marketDemand": "High/Medium/Low",
        "valueForMoney": "Excellent/Fair/Poor"
      },
      "curriculumHighlights": ["Skill 1", "Skill 2"],
      "pros": "Why it's worth it",
      "cons": "The honest drawback",
      "timeToOutcome": "e.g. 3-4 Months",
      "officialUrl": "Official URL"
    }
  ]
}`

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 3500,
        })

        const responseText = completion.choices[0]?.message?.content
        if (!responseText) {
            return { success: false, error: "Failed to generate recommendations" }
        }

        let recommendations: RecommendedCourse[]
        try {
            const parsed = JSON.parse(responseText)
            recommendations = parsed.recommendations || []
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
                toolName: "AI Course Recommender",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/course-recommender")

        return { success: true, data: recommendations }
    } catch (error: any) {
        console.error("Course Recommender Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
