import { prisma } from "@/lib/prisma";
import { Users, DollarSign, Activity } from "lucide-react";

export default async function AdminDashboard() {
    const userCount = await prisma.user.count();
    const premiumCount = await prisma.user.count({ where: { plan: "PREMIUM" } });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                    Admin <span className="text-blue-600">Dashboard</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    System Overview & Intelligence
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-xl rounded-[24px] p-6 flex items-center gap-5 group hover:scale-[1.02] transition-all duration-500">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Users</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{userCount}</p>
                    </div>
                </div>

                {/* Premium Members Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-xl rounded-[24px] p-6 flex items-center gap-5 group hover:scale-[1.02] transition-all duration-500">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Premium Members</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{premiumCount}</p>
                    </div>
                </div>

                {/* System Status Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-xl rounded-[24px] p-6 flex items-center gap-5 group hover:scale-[1.02] transition-all duration-500">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">System Status</p>
                        <p className="text-3xl font-black text-emerald-600 tracking-tight">ACTIVE</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
