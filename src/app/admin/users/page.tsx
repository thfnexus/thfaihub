import { prisma } from "@/lib/prisma";
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

export default async function UsersPage() {
    const users = (await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, role: true, plan: true, credits: true, createdAt: true, status: true } as any
    })) as unknown as User[];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                        User <span className="text-blue-600">Management</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                        Manage Ecosystem Access & Roles
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-500 w-full md:w-auto text-center">
                    Total: {users.length} Users
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white/60 backdrop-blur-xl border border-white rounded-[30px] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200/60">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-white/80 transition-colors group">
                                <td className="px-8 py-5 font-bold text-sm text-slate-700">{user.email}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                                        : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.plan === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700 shadow-sm' :
                                        user.plan === 'PRO' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {user.plan}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.status === 'SUSPENDED' ? 'bg-red-100 text-red-700 shadow-sm' : 'bg-green-100 text-green-700 shadow-sm'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-1 font-black text-xs text-slate-900">
                                        {user.credits} <span className="text-slate-400 font-normal">CR</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-slate-500 text-xs font-bold uppercase tracking-wide">{user.createdAt.toLocaleDateString()}</td>
                                <td className="px-8 py-5 text-right">
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-blue-700 hover:underline decoration-2 underline-offset-4"
                                    >
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white/80 backdrop-blur-xl border border-white p-5 rounded-[24px] shadow-lg flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-black text-sm shadow-sm border border-blue-200">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 break-all line-clamp-1">{user.email}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.createdAt.toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Link href={`/admin/users/${user.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <span className="sr-only">Manage</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Role</p>
                                <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Plan</p>
                                <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.plan === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : user.plan === 'PRO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {user.plan}
                                </span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {user.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2 pt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Balance</span>
                            <div className="flex items-center gap-1 font-black text-sm text-slate-900">
                                {user.credits} <span className="text-slate-400 font-bold text-[10px]">CR</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
