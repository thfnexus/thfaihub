import { auth } from "@/auth";
import { redirect } from "next/navigation";
import IncomeSourcesClient from "./IncomeSourcesClient";

export const metadata = {
    title: "Income Sources | THF AI Hub",
    description: "Get a personalized roadmap of income sources based on your skills, time, and goals across immediate, mid-term, and long-term horizons.",
};

export default async function IncomeSourcesPage() {
    const session = await auth();

    if (!session) {
        redirect("/login?callbackUrl=/tools/income-sources");
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <IncomeSourcesClient />
        </div>
    );
}
