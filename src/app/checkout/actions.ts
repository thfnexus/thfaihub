'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function processPayment(formData: FormData) {
    const plan = formData.get("plan") as any;
    const userId = formData.get("userId") as string;

    // Logic to process payment here (Stripe, etc)

    // Update User
    let creditsToAdd = 0;
    if (plan === "PRO") creditsToAdd = 60;
    if (plan === "PREMIUM") creditsToAdd = 200;
    if (plan === "FREE") creditsToAdd = 0;

    await prisma.user.update({
        where: { id: userId },
        data: {
            plan: plan,
            credits: { increment: creditsToAdd }
        }
    });

    redirect("/profile");
}
