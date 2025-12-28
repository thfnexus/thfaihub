'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface StrategicRoadmapInput {
    age: string
    country: string
    currentEducationSkills: string
    futureGoal: string
    dailyTimeCommitment: string
    learningStyle: string
    additionalNotes?: string
}

export interface RoadmapStep {
    period: string
    action: string
    type: 'education' | 'skill' | 'project' | 'internship' | 'job' | 'freelance'
}

export interface Milestone {
    period: string
    goal: string
    type: 'short' | 'medium' | 'long'
}

export interface RiskIndicator {
    factor: string
    level: 'High' | 'Medium' | 'Low'
    warning: string
}

export interface StrategicRoadmapResponse {
    careerArchetype: string
    roadmap: RoadmapStep[]
    milestones: Milestone[]
    risks: RiskIndicator[]
    masteryTips: string
    progressEstimates: {
        skills: number
        education: number
        readiness: number
    }
}

export async function generateStrategicRoadmap(
    formData: StrategicRoadmapInput
): Promise<{ success: boolean; data?: StrategicRoadmapResponse; error?: string }> {
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
            return { success: false, error: "Insufficient credits" }
        }

        const systemPrompt = `You are an expert Career Strategist and 5-Year Roadmap Architect for 2026-2030.
Your goal is to convert a user's career aspirations into a hyper-detailed, actionable step-by-step roadmap.
Integrate concepts like ROI, AI risk, and skill gaps into a unified 1-5 year plan.
Provide realistic milestones for short term (1-6mo), medium term (6-18mo), and long term (1-5yr).
Be brutally honest about market saturation and AI automation.
You MUST respond with ONLY valid JSON.`

        const userPrompt = `Build a 5-Year Strategic Roadmap for:
Age: ${formData.age}
Country: ${formData.country}
Current Education & Skills: ${formData.currentEducationSkills}
Future Goal: ${formData.futureGoal}
Daily Time: ${formData.dailyTimeCommitment}
Learning Style: ${formData.learningStyle}
Notes: ${formData.additionalNotes || 'None'}

Return JSON format:
{
  "careerArchetype": "e.g., The Global Tech Nomad",
  "roadmap": [
    { "period": "Month 1-3", "action": "Specific task", "type": "skill" },
    { "period": "Year 1", "action": "Specific task", "type": "internship" },
    { "period": "Year 2-3", "action": "Specific task", "type": "job" }
  ],
  "milestones": [
    { "period": "6 Months", "goal": "Earn first $500/mo or land Internship", "type": "short" },
    { "period": "18 Months", "goal": "Full-stack proficiency", "type": "medium" },
    { "period": "3-5 Years", "goal": "Senior role or Business owner", "type": "long" }
  ],
  "risks": [
    { "factor": "AI Automation", "level": "High", "warning": "Role X might be 80% automated by 2028." },
    { "factor": "Saturation", "level": "Medium", "warning": "Entry-level market in ${formData.country} is crowded." }
  ],
  "masteryTips": "Final strategic advice to win the roadmap.",
  "progressEstimates": {
    "skills": 30,
    "education": 60,
    "readiness": 25
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
            max_tokens: 3000,
        })

        const responseText = completion.choices[0]?.message?.content
        if (!responseText) {
            return { success: false, error: "Failed to generate roadmap" }
        }

        let roadmapData: StrategicRoadmapResponse
        try {
            roadmapData = JSON.parse(responseText)
        } catch (e) {
            return { success: false, error: "AI returned invalid format" }
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
                toolName: "Career Timeline Simulator",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/career-timeline")

        return { success: true, data: roadmapData }
    } catch (error: any) {
        console.error("Roadmap Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
