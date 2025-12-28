'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface ScholarshipPlannerInput {
    citizenship: string
    educationLevel: string
    otherEducationLevel?: string
    targetDegree: string
    otherTargetDegree?: string
    fieldOfStudy: string
    destinationCountry: string
    fundingPreference: string
    applicationStage: string
    languageProficiency: string
    preferredIntake: string
}

export interface ScholarshipMatch {
    name: string
    hostUniversity: string
    fundingType: string
    degreeLevel: string
    eligibleCountries: string[]
    deadline: string // Formatted date
    timeLeft: string
    sourceUrl: string
    lastVerified: string // Formatted date
    requiredTests: string // NEW: SAT, ACT, ECAT, MDCAT, etc.
    eligibilityExplanation: {
        qualifications: string
        rejectionRisks: string
        criticalRequirements: string
    }
    deadlineWarning: string
    honestAdvisory: {
        realisticChance: string
        weakPoints: string
        fixBeforeApplying: string
    }
}

export async function generateScholarshipAnalysis(
    formData: ScholarshipPlannerInput
): Promise<{ success: boolean; data?: ScholarshipMatch[]; error?: string }> {
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

        const systemPrompt = `You are an AI Scholarship Planner built for students who need ACCURATE, REAL-WORLD scholarship data.
You act as a Senior Education Consultant who has access to the latest 2026 university databases and global scholarship records.

⚠️ CRITICAL RULES (NON-NEGOTIABLE):
1. You MUST provide real, globally recognized scholarships that match the user's profile.
2. Every scholarship MUST identify the specific Host University or Institution offering it.
3. Ranking Logic: You MUST rank the results from 1 to 10 based on the "Best Fit" for the user's current grade (e.g., if Grade 11, show unis that have active 2026 admissions/scholarships for that level first).
4. For Students in Grade 11 or 12 (or anyone applying for Uni): You MUST highlight the mandatory University Entrance Tests (e.g., ECAT, MDCAT, NTS, SAT, GAT, etc.) SPECIFIC to the host university. For example, if it's NUST, mention NET. If it's medical in Pakistan, mention MDCAT.
5. If a scholarship deadline is ≤ 14 days, show ⚠️ "Urgent – Deadline Near".
6. For eligibility, say ONLY what is WRITTEN in official requirements. No "usually" or "might".
7. Provide a realistic advisory for the user's specific profile (Citizenship, IELTS, Field, etc.).
8. Talk like a REAL-WORLD EDUCATION DATA ADVISOR.

You MUST respond with ONLY valid JSON.`

        const userPrompt = `
USER PROFILE:
- Citizenship: ${formData.citizenship}
- Current Education: ${formData.educationLevel === 'Other' ? formData.otherEducationLevel : formData.educationLevel}
- Target Degree: ${formData.targetDegree === 'Other' ? formData.otherTargetDegree : formData.targetDegree}
- Field: ${formData.fieldOfStudy}
- Destination: ${formData.destinationCountry}
- Funding Preference: ${formData.fundingPreference}
- Application Stage: ${formData.applicationStage}
- Language: ${formData.languageProficiency}
- Intake: ${formData.preferredIntake}

TASK:
1. Suggest at least 10 REAL scholarships/universities that match this profile.
2. RANK them from 1 to 10 by "Best Fit" for the user's specific grade and level. Show the absolute best matching opportunities first.
3. For each, generate a detailed 2026 analysis.
4. Calculate 'timeLeft' based on today's date (${new Date().toISOString()}).

RETURN JSON FORMAT:
{
  "matches": [
    {
      "name": "Scholarship Name",
      "hostUniversity": "Specific University Offering the Scholarship",
      "fundingType": "Full / Partial",
      "degreeLevel": "Degree Level",
      "eligibleCountries": ["list"],
      "deadline": "DD Month YYYY",
      "timeLeft": "X days remaining",
      "sourceUrl": "Official University/Government URL",
      "lastVerified": "Recently Verified",
      "requiredTests": "Detail the EXACT university-specific entrance test (e.g., NET for NUST, ECAT for UET, MDCAT for Medical, etc.)",
      "eligibilityExplanation": {
        "qualifications": "What the student qualifies for",
        "rejectionRisks": "What may cause rejection",
        "criticalRequirements": "GPA, test scores, etc."
      },
      "deadlineWarning": "Urgent – Deadline Near (if <= 14 days) or Standard",
      "honestAdvisory": {
        "realisticChance": "Realistic or Low Chance",
        "weakPoints": "Why profile is weak",
        "fixBeforeApplying": "What to fix"
      }
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
            max_tokens: 4000,
        })

        const responseText = completion.choices[0]?.message?.content
        if (!responseText) {
            return { success: false, error: "Failed to generate scholarship matches" }
        }

        let matches: ScholarshipMatch[]
        try {
            const parsed = JSON.parse(responseText)
            matches = parsed.matches || []
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
                toolName: "AI Scholarship Planner",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/scholarship-planner")

        return { success: true, data: matches }
    } catch (error: any) {
        console.error("Scholarship Planner Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}
