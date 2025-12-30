import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function checkUserStatus() {
    const session = await auth();
    if (!session?.user?.id) return { authenticated: false };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { status: true, emailVerified: true } as any
    });

    if (!user) return { authenticated: false };

    const status = (user as any).status;
    const isVerified = !!(user as any).emailVerified;

    if (status === "SUSPENDED") {
        return { authenticated: true, suspended: true, verified: isVerified };
    }

    return { authenticated: true, suspended: false, verified: isVerified };
}
