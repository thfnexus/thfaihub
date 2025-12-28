'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface InterviewCoachInput {
    jobRole: string
    country: string
    experienceLevel: string
    companyName?: string
}

export interface InterviewAnalysisResponse {
    roleAnalysis: {
        responsibilities: string[]
        demandedSkills: {
            technical: string[]
            soft: string[]
        }
        industryTrends: string[]
    }
    topicBreakdown: {
        title: string
        importance: string
        depthExpected: string
    }[]
    interviewQuestions: {
        question: string
        whatIsTested: string
        sampleAnswer: string
        commonMistakes: string[]
    }[]
    preparationGuidance: {
        studyPriority: {
            high: string[]
            low: string[]
            dealBreakers: string[]
        }
        checklist: string[]
        estimatedTime: string
    }
    selfPractice: {
        tips: string[]
        confidenceVsKnowledge: string
    }
    realityCheck: {
        competitionLevel: string
        marketExpectations2026: string
        whatCandidatesLack: string[]
        howToStandOut: string
    }
}

export async function generateInterviewCoachAnalysis(
    formData: InterviewCoachInput
): Promise<{ success: boolean; data?: InterviewAnalysisResponse; error?: string }> {
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

        const systemPrompt = `You are an AI Interview Coach designed for real-market interview preparation (2026 standard).
Your goal is NOT to give generic interview questions. Your goal is to prepare the user exactly according to the current job market.

DATA RULES:
- Base analysis on: Public job descriptions (LinkedIn, Indeed, etc.), role-based competency frameworks, and country-specific hiring expectations.
- Assume requirements change frequently and prioritize current industry trends.

OUTPUT STYLE RULES:
- Be clear, structured, and practical.
- Use simple English.
- No fake hype, no motivational quotes.
- Speak like a senior hiring consultant.
- Focus on real interview success, not theory.
- You are NOT allowed to say: "Every interview is different" or "It depends".
- Give decisive, market-backed guidance.

You MUST respond with ONLY valid JSON.`

        const userPrompt = `Generate a comprehensive interview preparation guide for:
Target Job Role: ${formData.jobRole}
Country: ${formData.country}
Experience Level: ${formData.experienceLevel}
Company: ${formData.companyName || 'Not specified'}

The JSON structure MUST follow this exactly:
{
  "roleAnalysis": {
    "responsibilities": ["list string"],
    "demandedSkills": { "technical": ["list"], "soft": ["list"] },
    "industryTrends": ["list"]
  },
  "topicBreakdown": [
    { "title": "Topic Name", "importance": "Why it matters", "depthExpected": "Level of depth" }
  ],
  "interviewQuestions": [
    { 
      "question": "The Question", 
      "whatIsTested": "Interviewer intent", 
      "sampleAnswer": "Strong sample answer", 
      "commonMistakes": ["list"] 
    }
  ],
  "preparationGuidance": {
    "studyPriority": { "high": ["list"], "low": ["list"], "dealBreakers": ["list"] },
    "checklist": ["list of topics"],
    "estimatedTime": "e.g. 15-20 hours"
  },
  "selfPractice": {
    "tips": ["list"],
    "confidenceVsKnowledge": "Detailed comparison"
  },
  "realityCheck": {
    "competitionLevel": "High/Medium/Low with context",
    "marketExpectations2026": "Description",
    "whatCandidatesLack": ["list"],
    "howToStandOut": "Specific advice"
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
            return { success: false, error: "Failed to generate analysis" }
        }

        let analysisData: InterviewAnalysisResponse
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
                toolName: "AI Interview Coach",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/interview-coach")

        return { success: true, data: analysisData }
    } catch (error: any) {
        console.error("Interview Coach Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
