import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                credits: true,
                role: true,
                plan: true
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[USER_ME]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
