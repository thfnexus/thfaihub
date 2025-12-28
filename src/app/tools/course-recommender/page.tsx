import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import CourseRecommenderClient from "./CourseRecommenderClient"

export const metadata = {
    title: "AI Course Recommender | THF AI Hub",
    description: "Get ROI-focused course recommendations filtered by quality and job market demand.",
}

export default async function CourseRecommenderPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/course-recommender")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <main className="min-h-screen bg-slate-50">
            <CourseRecommenderClient userCredits={user?.credits || 0} />
        </main>
    )
}
