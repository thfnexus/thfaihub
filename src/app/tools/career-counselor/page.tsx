import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import CareerCounselorClient from "./CareerCounselorClient"

export default async function CareerCounselorPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/career-counselor")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    if (!user) redirect("/login")

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <CareerCounselorClient userCredits={user.credits} />
        </div>
    )
}
