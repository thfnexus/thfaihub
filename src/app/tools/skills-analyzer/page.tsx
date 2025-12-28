import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SkillsAnalyzerClient from "./SkillsAnalyzerClient"

export const metadata = {
    title: "AI Skills Analyzer | THF AI Hub",
    description: "Identify skill gaps and build your 2026 career roadmap.",
}

export default async function SkillsAnalyzerPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/skills-analyzer")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <SkillsAnalyzerClient userCredits={user?.credits || 0} />
        </div>
    )
}
