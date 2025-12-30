import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return new NextResponse("Missing token", { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token } as any
        });

        if (!user) {
            return new NextResponse("Invalid token", { status: 400 });
        }

        await (prisma.user.update as any)({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null,
            }
        });

        // Redirect to a success page or login
        return NextResponse.redirect(new URL("/login?verified=true", req.url));
    } catch (error) {
        console.error("Verification Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
