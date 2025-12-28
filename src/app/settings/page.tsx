import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) redirect("/login")

    return <SettingsForm user={user} />
}
