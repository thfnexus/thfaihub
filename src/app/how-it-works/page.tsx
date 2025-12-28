import { HelpCircle, UserPlus, Coins, Cpu, ClipboardList, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
    const steps = [
        {
            title: "Create free account",
            desc: "Join the nexus in seconds. No credit card required to start your journey.",
            icon: <UserPlus className="w-6 h-6" />,
            color: "bg-slate-900"
        },
        {
            title: "Get 10 free credits",
            desc: "We fuel your start. Every new account receives 10 neural credits instantly.",
            icon: <Coins className="w-6 h-6" />,
            color: "bg-blue-600"
        },
        {
            title: "Choose AI tool",
            desc: "Select from our specialized suite of career, scholarship, or profile analyzing nodes.",
            icon: <Cpu className="w-6 h-6" />,
            color: "bg-blue-400"
        },
        {
            title: "Enter profile details",
            desc: "Provide your background and goals—the more detail, the higher the precision.",
            icon: <ClipboardList className="w-6 h-6" />,
            color: "bg-slate-900"
        },
        {
            title: "Get real-world guidance",
            desc: "Receive actionable, data-backed roadmaps synced with current market standards.",
            icon: <Lightbulb className="w-6 h-6" />,
            color: "bg-blue-600"
        },
        {
            title: "Upgrade only if needed",
            desc: "Satisfied? Scale your success with higher credit limits. No commitment required.",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "bg-blue-400"
        }
    ]

    return (
        <div className="min-h-screen bg-[#F4F7FB] py-12 md:py-24 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header section */}
                <div className="max-w-3xl mx-auto text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <HelpCircle className="w-3.5 h-3.5" /> Zero Confusion
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        30-Second <span className="text-blue-600">Start.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-normal md:tracking-[0.25em] text-xs max-w-lg mx-auto leading-relaxed">
                        The fastest path from career curiosity to data-driven certainty.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="group relative">
                            <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-2">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg relative z-10`}>
                                        {step.icon}
                                    </div>
                                    <span className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">0{idx + 1}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-4">{step.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-20 bg-slate-900 rounded-[50px] p-6 md:p-16 text-center relative overflow-hidden group">
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-[0.3em]">
                            <CheckCircle2 className="w-4 h-4" /> Ready to Launch?
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                            The future doesn't <br /> <span className="text-blue-500">wait for anyone.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/signup" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98]">
                                Create Your Free Profile
                            </Link>
                            <Link href="/pricing" className="bg-white/10 text-white border border-white/10 hover:bg-white/20 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all backdrop-blur-md">
                                See Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
