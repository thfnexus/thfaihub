import { auth, signOut } from "@/auth"
import NavbarClient from "./NavbarClient"
import { prisma } from "@/lib/prisma"

export default async function Navbar() {
    const session = await auth()
    let credits = undefined
    let isAdmin = false

    if (session?.user?.id) {
        // try {
        //     const user = await prisma.user.findUnique({
        //         where: { id: session.user.id },
        //         select: { credits: true, role: true }
        //     })
        //     if (user) {
        //         credits = user.credits
        //         isAdmin = user.role === 'ADMIN'
        //     }
        // } catch (error) {
        //     console.error("Navbar DB Error (handled):", error)
        //     // Fail silently so build doesn't crash
        // }
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
