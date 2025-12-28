import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import CareerTimelineClient from "./CareerTimelineClient"

export const metadata = {
    title: "Career Timeline Simulator | THF AI Hub",
    description: "Convert your goals into a detailed 5-year strategic roadmap with milestones.",
}

export default async function CareerTimelinePage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/career-timeline")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <CareerTimelineClient userCredits={user?.credits || 0} />
        </div>
    )
}
