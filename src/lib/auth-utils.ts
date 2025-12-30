import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function checkUserStatus() {
    const session = await auth();
    if (!session?.user?.id) return { authenticated: false };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { status: true } as any
    });

    if (!user || (user as any).status === "SUSPENDED") {
        return { authenticated: true, suspended: true };
    }

    return { authenticated: true, suspended: false };
}
