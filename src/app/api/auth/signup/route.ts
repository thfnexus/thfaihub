import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { email, password, name, username } = await req.json()

        if (!email || !password || !name || !username) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            },
        })

        if (existingUser) {
            if (existingUser.email === email) return NextResponse.json({ error: "Email already exists" }, { status: 400 })
            if (existingUser.username === username) return NextResponse.json({ error: "Username already taken" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = crypto.randomUUID()

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                username,
                credits: 10, // Sign up bonus
                verificationToken,
            } as any,
        })

        // Import mail utility here or at top
        const { sendVerificationEmail } = await import("@/lib/mail")
        await sendVerificationEmail(email, verificationToken)

        return NextResponse.json({
            message: "Verification email sent. Please check your inbox.",
            user: { email: user.email, id: user.id }
        })
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
