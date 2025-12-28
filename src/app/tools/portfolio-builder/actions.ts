'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface PortfolioExperience {
    role: string
    company: string
    duration: string
    description: string
}

export interface PortfolioEducation {
    degree: string
    institution: string
    year: string
}

export interface PortfolioProjectInfo {
    name: string
    techStack: string
    description: string
    link?: string
}

export interface PortfolioBuilderInput {
    fullName: string
    targetRole: string
    bio: string
    experience: PortfolioExperience[]
    education: PortfolioEducation[]
    projects: PortfolioProjectInfo[]
    skills: string[]
}

export interface PortfolioBlueprint {
    optimizedBio: string
    refinedExperience: PortfolioExperience[]
    structuredProjects: {
        name: string
        techStack: string
        impactDescription: string // STAR method
        readmeSkeleton: string
        resumeSummary: string
    }[]
    education: PortfolioEducation[]
    skillsMatrix: {
        category: string
        skills: string[]
    }[]
    designAdvice: {
        themeColor: string
        typography: string
        layoutSuggestion: string
    }
    marketAnalysis: string
}

export async function generatePortfolioBlueprint(
    formData: PortfolioBuilderInput
): Promise<{ success: boolean; data?: PortfolioBlueprint; error?: string }> {
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

        const systemPrompt = `You are a Senior Strategic Portfolio Architect. 
Your goal is to transform raw user data into a high-impact, professional portfolio blueprint that passes 2026 hiring standards.

⚠️ CRITICAL RULES:
1. OPTIMIZATION: Refine the user's bio and experience to highlight "Impact" and "Scale".
2. STAR METHOD: Rewrite project descriptions using the STAR (Situation, Task, Action, Result) method.
3. TECH STACK: Group skills into logical categories (Core, Tools, Soft Skills).
4. DESIGN: Provide specific design tokens (Color, Typography) that suit the target role.
5. NO FLUFF: Keep descriptions technical and objective.

You MUST respond with ONLY valid JSON.`

        const userPrompt = `
USER DATA:
- Full Name: ${formData.fullName}
- Target Role: ${formData.targetRole}
- Raw Bio: ${formData.bio}
- Experience: ${JSON.stringify(formData.experience)}
- Education: ${JSON.stringify(formData.education)}
- Projects: ${JSON.stringify(formData.projects)}
- Skills: ${formData.skills.join(', ')}

TASK:
1. Generate an "Optimized Technical Bio" (2-3 sentences).
2. Refine "Experience" bullet points for maximum hiring signal.
3. Structure "Projects" using STAR method, providing README skeletons and Resume summaries.
4. Create a "Skills Matrix".
5. Provide "Design Advice" based on the role.
6. Provide a brief "Market Analysis" for this role in 2026.

RETURN JSON FORMAT:
{
  "optimizedBio": "...",
  "refinedExperience": [{"role": "...", "company": "...", "duration": "...", "description": "..."}],
  "structuredProjects": [
    {
      "name": "...",
      "techStack": "...",
      "impactDescription": "...",
      "readmeSkeleton": "...",
      "resumeSummary": "..."
    }
  ],
  "education": [{"degree": "...", "institution": "...", "year": "..."}],
  "skillsMatrix": [{"category": "...", "skills": ["...", "..."]}],
  "designAdvice": {
    "themeColor": "#HEX",
    "typography": "...",
    "layoutSuggestion": "..."
  },
  "marketAnalysis": "..."
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
            return { success: false, error: "Failed to generate portfolio blueprint" }
        }

        let blueprint: PortfolioBlueprint
        try {
            const parsed = JSON.parse(responseText)
            blueprint = parsed
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
                toolName: "AI Portfolio Architect",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/portfolio-builder")

        return { success: true, data: blueprint }
    } catch (error: any) {
        console.error("Portfolio Builder Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
