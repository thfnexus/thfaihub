import { BookOpen, Coins, Check, AlertCircle, ShieldCheck, Zap, Info, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function PricingExplainedPage() {
    return (
        <div className="min-h-screen bg-[#F4F7FB] py-12 md:py-24 px-4 overflow-x-hidden">
            <div className="container mx-auto max-w-5xl">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <BookOpen className="w-3.5 h-3.5" /> Anti-Confusion Guide
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Pricing <span className="text-blue-600">Framework.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-normal md:tracking-[0.25em] text-xs max-w-xl mx-auto leading-relaxed">
                        Everything you need to know about credits, plans, and choosing the right path for your career.
                    </p>
                </div>

                <div className="grid gap-12">
                    {/* What is a Credit Section */}
                    <div className="bg-white/80 backdrop-blur-2xl border border-white p-4 md:p-16 rounded-[50px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60 -z-10 group-hover:opacity-80 transition-opacity"></div>
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight flex items-center gap-3">
                                        <Coins className="w-8 h-8 text-blue-600" /> What is 1 Credit?
                                    </h2>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        Think of **Credits** as the fuel for our AI engine. Every time you ask a question or request an analysis, our neural nodes process massive amounts of data. Credits cover this computational power.
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-[30px] border border-slate-100">
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-blue-600" /> Usage Breakdown
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-sm font-bold text-slate-600">Standard Career Query</span>
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md">1 CREDIT</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-sm font-bold text-slate-600">Full Profile Analysis</span>
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md">2 CREDITS</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm font-bold text-slate-600">Deep Scholarship Sync</span>
                                            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md">5 CREDITS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 bg-blue-600 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5" /> Pro Tip
                                    </h3>
                                    <p className="text-white/80 font-medium leading-relaxed text-sm">
                                        "We give every new user **10 Free Credits** instantly. This is enough to perform a full profile analysis and get your first roadmap without spending a penny."
                                    </p>
                                </div>
                                <div className="p-5 bg-slate-900 rounded-[40px] text-white shadow-2xl">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 flex items-center gap-2 text-blue-400">
                                        <ShieldCheck className="w-5 h-5" /> No Hidden Fees
                                    </h3>
                                    <p className="text-slate-400 font-medium leading-relaxed text-sm italic">
                                        "Credits never expire. Once you buy them, they stay in your Nexus vault forever."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comparison matrix */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight text-center">Plan Comparison</h2>
                        <div className="overflow-x-auto bg-white/50 backdrop-blur-xl rounded-[40px] border border-white shadow-xl max-w-[85vw] md:max-w-full mx-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-4 md:px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Feature</th>
                                        <th className="px-4 md:px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">FREE</th>
                                        <th className="px-4 md:px-8 py-6 text-[10px] font-black uppercase tracking-widest text-blue-600">PRO</th>
                                        <th className="px-4 md:px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-900">PREMIUM</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 font-medium">
                                    <tr className="border-b border-slate-50">
                                        <td className="px-4 md:px-8 py-4 text-sm font-bold">Monthly Credits</td>
                                        <td className="px-4 md:px-8 py-4 text-xs font-black italic">10 (Once)</td>
                                        <td className="px-4 md:px-8 py-4 text-xs font-black italic text-blue-600">80</td>
                                        <td className="px-4 md:px-8 py-4 text-xs font-black italic text-slate-900">250</td>
                                    </tr>
                                    <tr className="border-b border-slate-50">
                                        <td className="px-4 md:px-8 py-4 text-sm font-bold">University Database</td>
                                        <td className="px-4 md:px-8 py-4"><Check className="w-4 h-4 text-blue-600" /></td>
                                        <td className="px-4 md:px-8 py-4"><Check className="w-4 h-4 text-blue-600" /></td>
                                        <td className="px-4 md:px-8 py-4"><Check className="w-4 h-4 text-blue-600" /></td>
                                    </tr>
                                    <tr className="border-b border-slate-50">
                                        <td className="px-4 md:px-8 py-4 text-sm font-bold">Analysis Precision</td>
                                        <td className="px-4 md:px-8 py-4 text-[10px] font-black uppercase text-slate-400">Standard</td>
                                        <td className="px-4 md:px-8 py-4 text-[10px] font-black uppercase text-blue-600">Advanced</td>
                                        <td className="px-4 md:px-8 py-4 text-[10px] font-black uppercase text-slate-900">Maximum</td>
                                    </tr>
                                    <tr className="border-b border-slate-50">
                                        <td className="px-4 md:px-8 py-4 text-sm font-bold">Priority Processing</td>
                                        <td className="px-4 md:px-8 py-4"><div className="w-2 h-0.5 bg-slate-200"></div></td>
                                        <td className="px-4 md:px-8 py-4"><div className="w-2 h-0.5 bg-slate-200"></div></td>
                                        <td className="px-4 md:px-8 py-4"><Check className="w-4 h-4 text-blue-600" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Who should choose what */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-white space-y-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Student Use-Case</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest mb-1">Choosing a major</h4>
                                    <p className="text-xs text-slate-500 font-medium">Use **FREE** to explore basics. 10 credits is plenty for 5-6 broad queries.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest mb-1">Applying for Uni</h4>
                                    <p className="text-xs text-slate-500 font-medium">Go **PRO**. 80 credits allows deeper university analysis and scholarship hunting.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest mb-1">Scaling Career</h4>
                                    <p className="text-xs text-slate-500 font-medium">Go **PREMIUM**. 250 credits for frequent neural syncs as you build your career.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 md:p-10 rounded-[40px] shadow-2xl text-white flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight">Still have <br /><span className="text-blue-500">questions?</span></h3>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs leading-relaxed">
                                Our support nodes are ready to clarify any billing or system queries.
                            </p>
                            <Link href="/support" className="flex items-center gap-2 bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-xl active:scale-[0.98]">
                                Contact Support <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
