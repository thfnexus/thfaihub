import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ Missing credentials')
                    return null
                }

                const email = credentials.email as string
                const user = await prisma.user.findUnique({ where: { email } })

                if (!user) {
                    console.log('❌ User not found:', email)
                    return null
                }

                const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)
                console.log('Password match result:', passwordsMatch)

                if (!passwordsMatch) {
                    console.log('❌ Password mismatch')
                    return null
                }

                console.log('✅ Login successful for:', email)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    plan: user.plan
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.plan = user.plan
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                try {
                    // Fetch fresh data for credits/plan
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: { role: true, plan: true, credits: true }
                    })

                    if (freshUser) {
                        session.user.role = freshUser.role
                        session.user.plan = freshUser.plan
                        // We'll attach credits to the session type if needed, or fetch in component
                        // For now, let's keep session minimal conform to types, or extend types for credits too.
                        // Extended types had role/plan. Credits is extra.
                    }
                } catch (error) {
                    console.error("Auth Session DB Error:", error)
                }
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
    }
})
