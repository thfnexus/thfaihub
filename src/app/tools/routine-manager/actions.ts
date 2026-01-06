'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import OpenAI from "openai"
import { startOfDay, endOfDay, subDays } from "date-fns"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface RoutineTaskInput {
    title: string
    deadline?: string
    priority: "urgent" | "important" | "normal"
    focusType: "deep_work" | "light_work" | "creative"
    estimatedMins: number
}

export interface RoutineManagerInput {
    wakeUpTime: string
    sleepTime: string
    studyJobHours: string
    energyPattern: string
    distractions: string[]
    stressLevel: string
    primaryFocus: string
    tasks: RoutineTaskInput[]
}

interface DailyBlock {
    time: string
    activity: string
    duration: string
    energyLevel: string
    type: "Deep Work" | "Light Work" | "Recovery" | "Break" | "Personal"
    pomodoro?: string // e.g. "25/5 cycle x 3"
}

interface RoutineResponse {
    dailySchedule: DailyBlock[]
    taskPrioritization: {
        highPriority: string[]
        mediumPriority: string[]
        lowPriority: string[]
    }
    breakStrategy: {
        type: string
        recommendation: string
    }
    distractionManagement: {
        blockingSuggestions: string[]
        dailyScore: number
        reductionTips: string[]
    }
    aiSuggestions: {
        scheduleOptimization: string
        sleepImprovement: string
        focusEnhancement: string
    }
    weeklyPlan: {
        routineType: string
        weeklyReview: string
        habitTips: string
    }
    burnoutProtection: {
        overworkWarnings: string
        sleepDeficitAlert: string
        distractionControl: string
    }
    adaptiveLogic: {
        ifRoutineFails: string
        ifEnergyLow: string
    }
}

export async function generateRoutinePlan(
    formData: RoutineManagerInput
): Promise<{ success: boolean; data?: RoutineResponse; error?: string }> {
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

        const systemPrompt = `You are an AI Productivity coach specializing in energy-based scheduling. 
        Your goal is to create a high-performance routine that integrates energy levels, task priorities, and burnout protection. 
        You must respond with ONLY valid JSON.`

        const userPrompt = `Create an optimized daily routine plan for this user:

Wake-up Time: ${formData.wakeUpTime}
Sleep Time: ${formData.sleepTime}
Study/Job Hours: ${formData.studyJobHours} hours
Energy Pattern: ${formData.energyPattern}
Daily Distractions: ${formData.distractions.join(", ") || "None specified"}
Current Stress Level: ${formData.stressLevel}/10
Primary Focus: ${formData.primaryFocus}

TASKS TO INTEGRATE:
${formData.tasks.map(t => `- ${t.title} (${t.priority}, ${t.focusType}, ${t.estimatedMins} min, Deadline: ${t.deadline || 'None'})`).join("\n")}

CRITICAL INSTRUCTIONS:
1. SCHEDULE OPTIMIZATION:
- Map "Deep Work" tasks to ${formData.energyPattern} peaks.
- Use Pomodoro (25/5) or 90-min blocks where appropriate.
- Include specific times for meals, exercise, and self-care.

2. TASK PRIORITIZATION:
- Rank tasks into High (Urgent/Important), Medium (Non-urgent/Important), and Low (Normal).

3. SMART BREAKS:
- Suggest break types based on the task preceding it.
- After a distraction-prone period, suggest a "reset" break.

4. DISTRACTION BLOCKING:
- Give a "Distraction Potential Score" (0-100).
- Suggest specific apps/methods to block for: ${formData.distractions.join(", ")}.

5. AI ANALYTICS:
- Suggest if they should shift their sleep/wake times based on their energy peaks.
- Suggest focus enhancement techniques tailored to their primary focus: ${formData.primaryFocus}.

RESPONSE FORMAT (JSON):
{
  "dailySchedule": [
    {
      "time": "7:00 AM",
      "activity": "Activity name",
      "duration": "Duration in min",
      "energyLevel": "Energy level",
      "type": "Deep Work/Light Work/Recovery/Break/Personal",
      "pomodoro": "Optional cycle info"
    }
  ],
  "taskPrioritization": {
    "highPriority": ["Task names"],
    "mediumPriority": ["Task names"],
    "lowPriority": ["Task names"]
  },
  "breakStrategy": {
    "type": "e.g., Ultra-Short / Interval / Deep Rest",
    "recommendation": "Specific advice"
  },
  "distractionManagement": {
    "blockingSuggestions": ["specific tips"],
    "dailyScore": 85,
    "reductionTips": ["tactical advice"]
  },
  "aiSuggestions": {
    "scheduleOptimization": "Advice on moving blocks",
    "sleepImprovement": "Sleep timing advice",
    "focusEnhancement": "Focus strategy"
  },
  "weeklyPlan": { "routineType": "...", "weeklyReview": "...", "habitTips": "..." },
  "burnoutProtection": { "overworkWarnings": "...", "sleepDeficitAlert": "...", "distractionControl": "..." },
  "adaptiveLogic": { "ifRoutineFails": "...", "ifEnergyLow": "..." }
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
            return { success: false, error: "Failed to generate routine plan" }
        }

        const routineData: RoutineResponse = JSON.parse(responseText)

        await prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { decrement: 1 } }
        })

        await prisma.usageLog.create({
            data: {
                userId: session.user.id,
                toolName: "AI Daily Routine Manager",
                creditsUsed: 1
            }
        })

        revalidatePath("/profile")
        revalidatePath("/tools/routine-manager")

        return { success: true, data: routineData }
    } catch (error: any) {
        console.error("Routine Manager Error:", error)
        return { success: false, error: error.message || "An error occurred" }
    }
}

// --- Task Management Actions ---

export async function getUserTasks() {
    const session = await auth()
    if (!session?.user?.id) return []

    return await prisma.routineTask.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createTask(task: RoutineTaskInput) {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    await prisma.routineTask.create({
        data: {
            userId: session.user.id,
            title: task.title,
            priority: task.priority,
            focusType: task.focusType,
            estimatedMins: task.estimatedMins,
            deadline: task.deadline ? new Date(task.deadline) : null
        }
    })
    revalidatePath("/tools/routine-manager")
    return { success: true }
}

export async function toggleTaskCompletion(id: string, completed: boolean) {
    await prisma.routineTask.update({
        where: { id },
        data: {
            completed,
            completedAt: completed ? new Date() : null
        }
    })
    revalidatePath("/tools/routine-manager")
    return { success: true }
}

export async function deleteTask(id: string) {
    await prisma.routineTask.delete({ where: { id } })
    revalidatePath("/tools/routine-manager")
    return { success: true }
}

// --- Performance Actions ---

export async function logPerformance(data: {
    hoursCompleted: number
    distractionMins: number
    focusScore: number
    stressLevel: number
    tasksCompleted: number
    tasksPlanned: number
}) {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    const today = startOfDay(new Date())

    await prisma.dailyPerformance.upsert({
        where: {
            userId_date: {
                userId: session.user.id,
                date: today
            }
        },
        update: data,
        create: {
            userId: session.user.id,
            date: today,
            ...data
        }
    })
    revalidatePath("/tools/routine-manager")
    return { success: true }
}

export async function getPerformanceHistory() {
    const session = await auth()
    if (!session?.user?.id) return []

    const weekAgo = subDays(new Date(), 7)

    return await prisma.dailyPerformance.findMany({
        where: {
            userId: session.user.id,
            date: { gte: weekAgo }
        },
        orderBy: { date: 'asc' }
    })
}

// --- Habit Stats ---

export async function getHabitStats() {
    const session = await auth()
    if (!session?.user?.id) return null

    return await prisma.habitStreak.findMany({
        where: { userId: session.user.id }
    })
}

export async function updateStreak(habitType: string) {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    const habit = await prisma.habitStreak.findUnique({
        where: { userId_habitType: { userId: session.user.id, habitType } }
    })

    const today = startOfDay(new Date())
    const yesterday = startOfDay(subDays(new Date(), 1))

    if (!habit) {
        await prisma.habitStreak.create({
            data: {
                userId: session.user.id,
                habitType,
                currentStreak: 1,
                longestStreak: 1,
                lastCompletedDate: today,
                xp: 10,
                level: 1
            }
        })
    } else {
        const lastDate = habit.lastCompletedDate ? startOfDay(habit.lastCompletedDate) : null
        let newStreak = habit.currentStreak

        if (lastDate?.getTime() === yesterday.getTime()) {
            newStreak += 1
        } else if (lastDate?.getTime() !== today.getTime()) {
            newStreak = 1
        }

        const newXP = habit.xp + 10
        const newLevel = Math.floor(newXP / 100) + 1

        await prisma.habitStreak.update({
            where: { id: habit.id },
            data: {
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, habit.longestStreak),
                lastCompletedDate: today,
                xp: newXP,
                level: newLevel
            }
        })
    }
    revalidatePath("/tools/routine-manager")
    return { success: true }
}

