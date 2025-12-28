import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ScholarshipPlannerClient from "./ScholarshipPlannerClient"

export const metadata = {
    title: "AI Scholarship Planner | THF AI Hub",
    description: "Verified, real-world scholarship data matched to your profile.",
}

export default async function ScholarshipPlannerPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/scholarship-planner")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <ScholarshipPlannerClient userCredits={user?.credits || 0} />
        </div>
    )
}
