import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    User,
    Mail,
    Calendar,
    Zap,
    Shield,
    LogOut,
    Brain,
    Rocket,
    CreditCard,
    ChevronRight,
    Star
} from "lucide-react";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch fresh user data
    let user;
    try {
        user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });
    } catch (error) {
        console.error("Profile DB Error:", error);
        redirect("/login");
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="container mx-auto py-12 px-4 max-w-5xl">
                {/* Header Section */}
                <div className="mb-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <User className="w-3 h-3" /> Account Dashboard
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        User <span className="text-blue-600">Profile</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Neural Account Management v2.0</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Info Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                            {/* Decorative Background Icon */}
                            <User className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-50 group-hover:text-blue-50/50 transition-colors duration-700" />

                            <div className="relative space-y-10">
                                <div className="flex flex-col md:flex-row md:items-center gap-6 pb-10 border-b-2 border-slate-50">
                                    <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-900/20">
                                        <User className="w-12 h-12 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated User</h3>
                                        <p className="text-2xl font-black text-slate-950 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-xl">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Email</label>
                                                <p className="font-bold text-slate-900">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 rounded-xl">
                                                <Calendar className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Member Since</label>
                                                <p className="font-bold text-slate-900">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 rounded-xl">
                                                <Shield className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Account Status</label>
                                                <p className="font-bold text-slate-900">Verified Professional</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 rounded-xl">
                                                <Brain className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Neural Access</label>
                                                <p className="font-bold text-slate-900">8 Core Tools Enabled</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mock / Placeholder for future */}
                        <div className="bg-slate-900 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden">
                            <Rocket className="absolute -top-4 -right-4 w-32 h-32 text-white/5" />
                            <div className="relative">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 flex items-center gap-3">
                                    < Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                    Account Perks
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        { title: "Global Planning", icon: <CreditCard className="w-4 h-4" /> },
                                        { title: "AI Mentorship", icon: <Brain className="w-4 h-4" /> },
                                        { title: "Neural Engines", icon: <Zap className="w-4 h-4" /> }
                                    ].map((perk, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                                            <div className="p-2 bg-white/10 rounded-lg">{perk.icon}</div>
                                            <span className="text-xs font-black uppercase tracking-widest">{perk.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription & Credits Card */}
                    <div className="space-y-8">
                        <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-2xl shadow-slate-200/50">
                            <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tighter mb-8 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-blue-600 fill-blue-600" /> Subscription
                            </h3>

                            <div className="space-y-8">
                                <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 flex items-center justify-between">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Tier</label>
                                        <p className="text-2xl font-black text-slate-950 italic uppercase">{user.plan}</p>
                                    </div>
                                    <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                                        <Star className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Neural Credits</label>
                                            <p className="text-5xl font-black text-blue-600 tracking-tighter italic">{user.credits}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-50">
                                        <div
                                            className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                            style={{ width: `${Math.min((user.credits / 100) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Neural processing power capacity</p>
                                </div>

                                <Link
                                    href="/pricing"
                                    className="flex items-center justify-between w-full p-5 bg-slate-950 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-950/20"
                                >
                                    Optimize My Plan <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Note: In a real app, Logout usually goes to a form or a specific action. 
                            For now, keeping it simple or linking to a logout route if it exists. */}
                        <div className="p-6">
                            <Link
                                href="/api/auth/signout"
                                className="w-full flex items-center justify-center gap-3 py-4 text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:text-red-500 transition-colors group"
                            >
                                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Terminate Session
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Attribution */}
                <div className="mt-20 text-center opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">This AI Trained and published by THF NEXUS</p>
                </div>
            </div>
        </div>
    );
}
