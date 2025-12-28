'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const name = formData.get("name") as string
    const username = formData.get("username") as string

    if (!name || !username) {
        return { error: "Name and Username are required", success: "" }
    }

    // Check unique username if changed
    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (currentUser?.username !== username) {
        const existing = await prisma.user.findUnique({
            where: { username }
        })
        if (existing) {
            return { error: "Username already taken", success: "" }
        }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name, username }
        })
        revalidatePath("/settings")
        revalidatePath("/profile")
        return { success: "Profile updated successfully!", error: "" }
    } catch (error) {
        return { error: "Failed to update profile", success: "" }
    }
}
