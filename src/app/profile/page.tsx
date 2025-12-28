import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch fresh user data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                            <p className="text-lg font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Plan</label>
                            <div className="text-2xl font-bold text-black mt-1">{user.plan}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Remaining Credits</label>
                            <div className="text-4xl font-bold text-blue-600 mt-1">{user.credits}</div>
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <Link
                            href="/pricing"
                            className="inline-block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Upgrade Plan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
