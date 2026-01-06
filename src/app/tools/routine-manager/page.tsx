import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RoutineManagerClient from "./RoutineManagerClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Daily Routine Manager | THF AI Hub",
    description: "Get an energy-based daily schedule that prevents burnout, boosts focus, and adapts to your unique productivity patterns.",
};

export default async function RoutineManagerPage() {
    const session = await auth();

    if (!session) {
        redirect("/login?callbackUrl=/tools/routine-manager");
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <RoutineManagerClient />
        </div>
    );
}
