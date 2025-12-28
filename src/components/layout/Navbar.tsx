import { auth, signOut } from "@/auth"
import NavbarClient from "./NavbarClient"
export default async function Navbar() {
    const session = await auth()

    // We fetch detailed user data (credits, role) client-side now
    // to prevent build-time database connection errors.

    async function handleLogout() {
        "use server"
        await signOut()
    }

    return <NavbarClient
        session={session}
        // We pass undefined initially, Client will fetch fresh data
        userCredits={undefined}
        isAdmin={false} // Client will verify admin status
        logoutAction={handleLogout}
    />
}

