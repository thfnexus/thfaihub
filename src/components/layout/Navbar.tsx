import { auth, signOut } from "@/auth"
import NavbarClient from "./NavbarClient"
import { prisma } from "@/lib/prisma"

export default async function Navbar() {
    const session = await auth()
    let credits = undefined
    let isAdmin = false

    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true, role: true }
        })
        if (user) {
            credits = user.credits
            isAdmin = user.role === 'ADMIN'
        }
    }

    async function handleLogout() {
        "use server"
        await signOut()
    }

    return <NavbarClient
        session={session}
        userCredits={credits}
        isAdmin={isAdmin}
        logoutAction={handleLogout}
    />
}
