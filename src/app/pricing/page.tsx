import Link from "next/link";
import { Check, Zap, ArrowRight } from "lucide-react";

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Experience the power of THF AI Hub with a free starter pack.",
            features: [
                "10 Credits (Sign-up Bonus)",
                "Basic tool access",
                "Standard processing",
                "Community support"
            ],
            button: "Get Started",
            highlight: false,
        },
        {
            name: "Pro",
            price: "$15",
            description: "🚀 Serious career growth with priority access and increased capacity.",
            features: [
                "80 Credits / Month",
                "All AI Tools Unlocked",
                "Priority AI Processing",
                "Advanced Career Analysis",
                "Priority Support Access"
            ],
            button: "Upgrade to Pro",
            highlight: true,
        },
        {
            name: "Premium",
            price: "$40",
            description: "💎 The ultimate elite package for power users and heavy career architecting.",
            features: [
                "250 Credits / Month",
                "Advanced Bulk Tool Modes",
                "Unlimited History Access",
                "Enterprise-Grade Analysis",
                "Personalized Roadmap Strategy",
                "24/7 VIP Support"
            ],
            button: "Go Premium",
            highlight: false,
        },
    ];

    return (
        <div className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold text-center mb-4">Simple Pricing</h1>
                <p className="text-center text-gray-600 mb-12">Checking out our beta? Pricing may change.</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`p-6 md:p-10 rounded-[40px] border transition-all duration-500 hover:scale-[1.02] ${plan.highlight
                                ? "border-slate-900 bg-slate-900 text-white shadow-2xl relative overflow-hidden"
                                : "border-slate-200 bg-white text-slate-900 shadow-xl"
                                } flex flex-col`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="bg-cyan-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        Best Value
                                    </div>
                                </div>
                            )}

                            <h3 className={`text-2xl font-black mb-1 uppercase italic tracking-tight ${plan.highlight ? "text-cyan-400" : "text-slate-900"}`}>
                                {plan.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className={`text-sm font-bold uppercase tracking-widest ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                                    /month
                                </span>
                            </div>

                            <p className={`text-sm font-medium mb-8 leading-relaxed ${plan.highlight ? "text-slate-300" : "text-slate-500"}`}>
                                {plan.description}
                            </p>

                            <ul className="mb-10 space-y-4 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm font-bold">
                                        <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? "text-cyan-400" : "text-emerald-500"}`} />
                                        <span className={plan.highlight ? "text-slate-200" : "text-slate-600"}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/checkout?plan=${plan.name.toUpperCase()}`}
                                className={`text-center py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${plan.highlight
                                    ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                                    }`}
                            >
                                {plan.button}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="relative mt-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 blur-3xl -z-10 rounded-[50px]"></div>
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                        {/* Decorative background element */}
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

                        <div className="flex-1 space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <Zap className="w-3 h-3" /> Custom Architecture
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                                Need More <span className="text-cyan-600">Extra Credits?</span>
                            </h2>
                            <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                                Looking for a custom bulk package or enterprise-grade neural access? Our team can architect a personalized plan tailored to your specific career goals.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <Link
                                href="/support"
                                className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                Contact Support
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
