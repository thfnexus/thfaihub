import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex h-full bg-gray-50">
            <aside className="w-64 bg-white border-r hidden md:block">
                <div className="p-6 border-b">
                    <h2 className="font-bold text-lg">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Users className="w-5 h-5" /> User Management
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
