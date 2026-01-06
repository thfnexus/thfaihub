'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface IncomeSourcesInput {
    country: string
    age: string
    education: string
    skills: string
    internetAccess: string
    dailyTime: string
    riskLevel: string
    goalType: string
}

interface IncomeIdea {
    title: string
    earningRange: string
    skillRequirement: string
    timeInvestment: string
    riskLevel: string
    countryRelevance: string
    growthPotential: string
}

interface IncomeSourcesResponse {
    immediate: IncomeIdea[]
    midTerm: IncomeIdea[]
    longTerm: IncomeIdea[]
    realityChecks: {
        saturation: string
        patience: string
        scamWarnings: string
    }
    mindsetAdvice: {
        motivation: string
        actionSteps: string
        successMindset: string
    }
}

export async function generateIncomeSources(
    formData: IncomeSourcesInput
): Promise<{ success: boolean; data?: IncomeSourcesResponse; error?: string }> {
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

        const systemPrompt = "You are an AI Income Strategist and Motivational Coach specializing in personalized earning roadmaps. Your goal is to MOTIVATE users, build their confidence, and provide honest, data-backed earning opportunities for 2026. Be encouraging, realistic, and help them develop a wealth-building mindset. You must respond with ONLY valid JSON."

        const userPrompt = `Generate a personalized Income Sources map for the following user profile:

Country: ${formData.country}
Age: ${formData.age}
Education: ${formData.education}
Current Skills: ${formData.skills}
Internet Access: ${formData.internetAccess}
Daily Available Time: ${formData.dailyTime}
Risk Level: ${formData.riskLevel}
Goal Type: ${formData.goalType}

Provide a structured roadmap across three timelines:
1. Immediate (0-30 days): Focus on micro-work, local/remote gigs, beginner freelancing.
2. Mid-Term (1-6 months): Focus on skill-based freelancing, remote jobs, online services.
3. Long-Term (6-24 months): Focus on SaaS, automation, content, scalable products.

For EACH idea, include: estimated monthly earning range (be REALISTIC and reasonable for ${formData.country}), skill requirements, time investment, risk level, country relevance, and growth potential.

CRITICAL - Reality Checks Section:
You MUST analyze the EXACT income sources you listed in immediate[], midTerm[], and longTerm[] arrays above. DO NOT mention generic categories like "SaaS", "Content Creation", or "Freelancing" unless those were the EXACT titles you used in your suggestions.

Write Reality Checks as follows:
- Saturation: "Among the options listed above, [list 2-3 EXACT titles from your suggestions] are more crowded in ${formData.country} because..."
- Patience: "From the roadmap above, [list 2-3 EXACT titles from your suggestions] will take longer because..." 
- Scam Warnings: "For [list 2-3 EXACT titles from your suggestions], watch out for..."

Example (if you suggested "Python Automation Scripts" and "Data Entry Work"):
- Patience: "From the roadmap above, Python Automation Scripts and Upwork Freelancing will take longer because they require building a portfolio first."

NOT like this: "SaaS Product Development will take longer..." (unless you literally suggested an income source titled "SaaS Product Development")

INCLUDE Mindset Advice:
- Motivation: An encouraging message that acknowledges their starting point and inspires them to take action
- Action Steps: 3-5 concrete first steps they should take THIS WEEK to start their journey
- Success Mindset: Key mental shifts needed to succeed in earning online/remotely

CRITICAL: 
1. Do NOT provide generic "Top 10" lists. Tailor the advice based on their Country and Internet Access (${formData.internetAccess}).
2. Be REALISTIC with earning ranges - don't overpromise. Consider ${formData.country} market rates.
3. Be MOTIVATING and ENCOURAGING - help them believe they can do this.

Return JSON format:
{
  "immediate": [
    {
      "title": "String",
      "earningRange": "Realistic range in USD/month for ${formData.country}",
      "skillRequirement": "Description",
      "timeInvestment": "Hours/day",
      "riskLevel": "Low/Med/High",
      "countryRelevance": "High/Medium/Low based on ${formData.country}",
      "growthPotential": "Description"
    }
  ],
  "midTerm": [...],
  "longTerm": [...],
  "realityChecks": {
    "saturation": "String",
    "patience": "String",
    "scamWarnings": "String"
  },
  "mindsetAdvice": {
    "motivation": "Encouraging message",
    "actionSteps": "3-5 specific steps to take this week",
    "successMindset": "Key mental shifts for success"
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
            max_tokens: 2500,
        })

        const responseText = completion.choices[0]?.message?.content
        if (!responseText) {
            return { success: false, error: "Failed to generate income map" }
        }

        let guidanceData: IncomeSourcesResponse
        try {
            guidanceData = JSON.parse(responseText)
            if (!guidanceData.immediate || !guidanceData.midTerm || !guidanceData.longTerm || !guidanceData.realityChecks || !guidanceData.mindsetAdvice) {
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
                toolName: "Income Sources",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/income-sources")

        return { success: true, data: guidanceData }
    } catch (error: any) {
        console.error("Income Sources Error:", error)
        return {
            success: false,
            error: error.message || "An error occurred"
        }
    }
}
