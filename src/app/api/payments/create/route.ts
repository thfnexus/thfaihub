import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { plan, transactionId } = body;

        if (!plan || !transactionId) {
            return NextResponse.json({ message: "Plan and Transaction ID are required" }, { status: 400 });
        }

        // Price mapping (optional validation)
        const prices: Record<string, number> = {
            'PRO': 15, // Using $ for consistency with plan, but could be PKR
            'PREMIUM': 40
        };

        const amount = prices[plan] || 0;

        // Check if transaction ID already exists
        const existing = await prisma.paymentRequest.findUnique({
            where: { transactionId }
        });

        if (existing) {
            return NextResponse.json({ message: "This Transaction ID has already been submitted." }, { status: 409 });
        }

        const paymentRequest = await prisma.paymentRequest.create({
            data: {
                userId: session.user.id,
                plan,
                transactionId,
                amount,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ message: "Payment request submitted successfully", paymentRequest }, { status: 201 });

    } catch (error) {
        console.error("Payment submission error details:", error);
        return NextResponse.json({ message: "Internal Server Error: " + (error as any).message }, { status: 500 });
    }
}
