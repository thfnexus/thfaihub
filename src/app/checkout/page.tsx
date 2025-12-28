import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CheckoutPageClient from "./CheckoutClient";

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ plan?: string }>;
}) {
    const session = await auth();
    const { plan } = await searchParams;

    const initialPlan = plan?.toUpperCase() || "PRO";

    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/checkout?plan=${initialPlan}`);
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) redirect("/login");

    return <CheckoutPageClient user={user as any} initialPlan={initialPlan} />;
}
