import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";

interface ToolPlaceholderProps {
    toolName: string;
}

export default async function ToolPlaceholder({ toolName }: ToolPlaceholderProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=" + encodeURIComponent(`/tools/${toolName.toLowerCase().replace(/ /g, "-")}`));
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) redirect("/login");

    const hasCredits = user.credits > 0;

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    {hasCredits ? (
                        <span className="text-4xl">🛠️</span>
                    ) : (
                        <Lock className="w-10 h-10 text-gray-400" />
                    )}
                </div>

                <h1 className="text-3xl font-bold">{toolName}</h1>

                {!hasCredits ? (
                    <div className="p-6 border border-red-200 bg-red-50 rounded-xl">
                        <h3 className="text-red-700 font-bold text-lg mb-2">Access Locked</h3>
                        <p className="text-red-600 mb-4">You have 0 credits remaining.</p>
                        <Link href="/pricing" className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                            Get More Credits
                        </Link>
                    </div>
                ) : (
                    <div className="p-8 border border-blue-200 bg-blue-50 rounded-xl">
                        <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-bold mb-4">
                            COMING SOON
                        </div>
                        <p className="text-blue-900 text-lg">
                            This AI tool is currently under development. <br />
                            Your {user.credits} credits are safe.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
