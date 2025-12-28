import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PortfolioBuilderClient from "./PortfolioBuilderClient"

export const metadata = {
    title: "AI Portfolio Builder | THF AI Hub",
    description: "Build a professional portfolio that meets real-world market standards using AI-guided templates.",
}

export default async function PortfolioBuilderPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/tools/portfolio-builder")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    })

    return (
        <main className="min-h-screen bg-slate-50">
            <PortfolioBuilderClient userCredits={user?.credits || 0} />
        </main>
    )
}
