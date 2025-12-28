import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import DegreeVsSkillClient from "./DegreeVsSkillClient"

export const metadata = {
    title: "Degree vs Skill Simulator | THF AI Hub",
    description: "Compare the value of formal education vs practical skills for your career path.",
}

export default async function DegreeVsSkillPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/degree-vs-skill")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <DegreeVsSkillClient userCredits={user?.credits || 0} />
        </div>
    )
}
