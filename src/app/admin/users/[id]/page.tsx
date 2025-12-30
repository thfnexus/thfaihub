import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface User {
    id: string;
    email: string;
    role: string;
    plan: string;
    credits: number;
    createdAt: Date;
    status: string;
}

async function updateUser(formData: FormData) {
    "use server"
    const userId = formData.get("userId") as string;
    const plan = formData.get("plan") as any;
    const role = formData.get("role") as any;
    const credits = parseInt(formData.get("credits") as string);
    const action = formData.get("action");

    if (action === "suspend") {
        await (prisma.user.update as any)({
            where: { id: userId },
            data: { status: "SUSPENDED", credits: 0 }
        });
    } else if (action === "unsuspend") {
        await (prisma.user.update as any)({
            where: { id: userId },
            data: { status: "ACTIVE" }
        });
    } else {
        // Fetch current user to check for changes
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true, credits: true }
        });

        let finalCredits = credits;

        // Plan Default Credits
        const planDefaults: Record<string, number> = {
            'FREE': 10,
            'PRO': 80,
            'PREMIUM': 250
        };

        if (currentUser && plan !== currentUser.plan) {
            // If plan changed and credits field wasn't manually modified from old value
            if (credits === currentUser.credits) {
                finalCredits = planDefaults[plan] || credits;
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { plan, role, credits: finalCredits }
        });
    }

    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = (await prisma.user.findUnique({
        where: { id },
    })) as unknown as User;

    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Link href="/admin/users" className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                <div className="p-1 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                Back to Users
            </Link>

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                    Manage <span className="text-blue-600">User</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Edit Credentials & Access Level
                </p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[30px] shadow-2xl p-6 md:p-12 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl -z-10 opacity-50" />

                <div className="flex items-center gap-4 pb-8 border-b border-slate-200/60">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/20">
                        {user.email[0].toUpperCase()}
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">User Email</label>
                        <p className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {user.email}
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${user.status === 'SUSPENDED' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {user.status}
                            </span>
                        </p>
                    </div>
                </div>

                <form action={updateUser} className="space-y-8">
                    <input type="hidden" name="userId" value={user.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">System Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    defaultValue={user.role}
                                    className="w-full p-4 rounded-xl bg-white/50 border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-white/80"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Subscription Plan</label>
                            <div className="relative">
                                <select
                                    name="plan"
                                    defaultValue={user.plan}
                                    className="w-full p-4 rounded-xl bg-white/50 border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-white/80"
                                >
                                    <option value="FREE">FREE</option>
                                    <option value="PRO">PRO</option>
                                    <option value="PREMIUM">PREMIUM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Available Credits</label>
                        <input
                            type="number"
                            name="credits"
                            defaultValue={user.credits}
                            className="w-full p-4 rounded-xl bg-white/50 border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                            💡 Change plan to auto-reset credits to plan default (FREE: 10, PRO: 80, PREMIUM: 250).
                        </p>
                    </div>

                    {user.status !== 'SUSPENDED' && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                            <span className="text-lg">⚠️</span>
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-relaxed">
                                Note: Suspending this account will immediately reset their credits to 0 to prevent further use.
                            </p>
                        </div>
                    )}

                    <div className="pt-8 border-t border-slate-200/60 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                        {user.status === 'SUSPENDED' ? (
                            <button name="action" value="unsuspend" className="px-6 py-3 rounded-xl text-green-500 text-xs font-black uppercase tracking-widest hover:bg-green-50 transition-colors border border-green-200">
                                Reactivate Account
                            </button>
                        ) : (
                            <button name="action" value="suspend" className="px-6 py-3 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-colors border border-red-200">
                                Suspend Account
                            </button>
                        )}
                        <button type="submit" className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-xl shadow-slate-900/10 active:scale-[0.98]">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
