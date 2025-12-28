import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import InterviewCoachClient from "./InterviewCoachClient"

export const metadata = {
    title: "AI Interview Coach | THF AI Hub",
    description: "Prepare for your next interview with 2026 real-market standards.",
}

export default async function InterviewCoachPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/interview-coach")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <InterviewCoachClient userCredits={user?.credits || 0} />
        </div>
    )
}
