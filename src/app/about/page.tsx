import { Fingerprint, Info, Globe, Users, Target, ShieldCheck, Sparkles, Building2 } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F4F7FB] py-12 md:py-24 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <Fingerprint className="w-3.5 h-3.5" /> The Original vision
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Bridge the <span className="text-blue-600">Gap.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-normal md:tracking-[0.25em] text-xs max-w-xl mx-auto leading-relaxed">
                        Why we built the world's most sophisticated AI Career Navigator for students and parents.
                    </p>
                </div>

                <div className="grid gap-12">
                    {/* Mission Card */}
                    <div className="bg-white/80 backdrop-blur-2xl border border-white p-6 md:p-16 rounded-[50px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60 -z-10 group-hover:opacity-80 transition-opacity"></div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">The Problem We Solve</h2>
                                    <p className="text-slate-600 font-medium leading-relaxed text-lg italic">
                                        "Most students choose careers based on outdated advice, while parents worry about the ROI of education in an AI-driven world."
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        THF AI Hub exists to provide **Career Clarity**. We replace guesswork with data-driven intelligence, helping students navigate the complex landscape of global higher education, scholarships, and the modern job market.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
                                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Verified Data</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
                                            <Globe className="w-4 h-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Global Standards</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 md:p-10 rounded-[40px] shadow-2xl relative group-hover:scale-[1.02] transition-transform duration-500">
                                <Sparkles className="absolute -top-6 -right-6 w-16 h-16 text-blue-400 rotate-12" />
                                <h3 className="text-white font-black text-xl uppercase italic tracking-tight mb-6">Real-Data Promise</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium">Synced with 12,000+ accredited universities worldwide.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium">Real-time scholarship tracking across 85 countries.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium">Neural mapping of 500+ emerging tech career paths.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branding Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-white flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Built by THF Nexus</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    THF AI Hub is a flagship product of the **THF Nexus** ecosystem—a global leader in engineering human-centric AI solutions. We don't just use AI; we train it to understand the nuances of human ambition.
                                </p>
                            </div>
                            <Link href="https://thfnexus.com" target="_blank" className="mt-8 text-blue-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                Explore the nexus <span className="text-lg">→</span>
                            </Link>
                        </div>

                        <div className="bg-blue-600 p-6 md:p-10 rounded-[40px] shadow-2xl shadow-blue-600/20 text-white flex flex-col justify-center items-center text-center space-y-6">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Ready for Clarity?</h3>
                            <p className="text-white/80 font-bold uppercase tracking-widest text-xs">Join 10,000+ students carving their path today.</p>
                            <Link href="/signup" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-xl active:scale-[0.98]">
                                Start Your Analysis
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
