'use client'

import { useState } from "react"
import { CreditCard, Lock, Check, ShieldCheck, Zap, Diamond, Rocket } from "lucide-react"
import Link from "next/link"
import { processPayment } from "./actions"
import { cn } from "@/lib/utils"

interface CheckoutPageProps {
    user: {
        id: string
        plan: string
    }
    initialPlan: string
}

export default function CheckoutPageClient({ user, initialPlan }: CheckoutPageProps) {
    const [selectedPlan, setSelectedPlan] = useState(initialPlan)

    const plans = [
        {
            name: "FREE",
            price: 0,
            credits: "10 credits",
            icon: <Zap className="w-5 h-5 text-emerald-500" />,
            description: "Entry-level access"
        },
        {
            name: "PRO",
            price: 15,
            credits: "80 credits/month",
            icon: <Rocket className="w-5 h-5 text-cyan-400" />,
            description: "Serious growth mode",
            highlight: true
        },
        {
            name: "PREMIUM",
            price: 40,
            credits: "250 credits/month",
            icon: <Diamond className="w-5 h-5 text-purple-400" />,
            description: "Enterprise intensity"
        },
    ]

    const currentPlanDetails = plans.find(p => p.name === selectedPlan) || plans[1];
    const isCurrentPlan = user.plan === selectedPlan
    const isFreePlan = selectedPlan === 'FREE'

    return (
        <div className="py-12 md:py-24 px-4 bg-slate-50 min-h-screen">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Secure <span className="text-cyan-600">Checkout</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Professional Neural Network Infrastructure
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Interactive Plan Selection */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-900 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h2 className="font-black text-xl uppercase italic text-slate-900">Select Your Tier</h2>
                        </div>

                        <div className="grid gap-4">
                            {plans.map((p) => (
                                <div
                                    key={p.name}
                                    onClick={() => setSelectedPlan(p.name)}
                                    className={cn(
                                        "p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 flex justify-between items-center group",
                                        selectedPlan === p.name
                                            ? "border-slate-900 bg-slate-900 text-white shadow-2xl scale-[1.02]"
                                            : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                                    )}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "p-4 rounded-2xl transition-colors",
                                            selectedPlan === p.name ? "bg-white/10" : "bg-slate-50 group-hover:bg-slate-100"
                                        )}>
                                            {p.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg uppercase italic tracking-tight">{p.name}</h3>
                                            <p className={cn(
                                                "text-xs font-bold uppercase tracking-widest",
                                                selectedPlan === p.name ? "text-slate-400" : "text-slate-500"
                                            )}>{p.credits}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-2xl tracking-tighter italic">
                                            ${p.price}
                                        </div>
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            selectedPlan === p.name ? "text-cyan-400" : "text-slate-400"
                                        )}>per month</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Box */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl space-y-6">
                            <h2 className="font-black text-lg uppercase italic text-slate-900 border-b border-slate-100 pb-4">Transactional Details</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Active Architecture</span>
                                    <span className="font-black text-slate-900 uppercase italic">{selectedPlan} Plan</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Processing Fee</span>
                                    <span className="font-black text-emerald-500 uppercase italic">WAIVED</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                                    <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total Commitment</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-slate-900 italic">${currentPlanDetails.price}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">USD / Monthly</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200 shadow-2xl h-fit sticky top-24">
                            {isCurrentPlan ? (
                                <div className="text-center py-12 space-y-6">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                        <Check className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-900 uppercase italic">Architecture Active</h2>
                                        <p className="text-slate-500 font-bold text-sm leading-relaxed">You are already deployed on the {selectedPlan} neural infrastructure.</p>
                                    </div>
                                    <Link href="/profile" className="block w-full bg-slate-900 text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl">
                                        Return to Nexus Hub
                                    </Link>
                                </div>
                            ) : (
                                <form action={processPayment} className="space-y-8">
                                    <input type="hidden" name="plan" value={selectedPlan} />
                                    <input type="hidden" name="userId" value={user.id} />

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 uppercase italic">Authorization</h3>
                                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Secure Gateway Connection Active</p>
                                    </div>

                                    {!isFreePlan ? (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Information</label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-cyan-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-cyan-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CVV</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-cyan-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-3">
                                            <div className="flex items-center gap-3 text-emerald-700">
                                                <Zap className="w-5 h-5" />
                                                <span className="font-black uppercase italic text-sm">Zero Commitment Tier</span>
                                            </div>
                                            <p className="text-xs text-emerald-600 font-bold leading-relaxed">
                                                The Free Plan does not require credit card authorization. Click below to activate your starter credits.
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 space-y-4">
                                        <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-[0.98]">
                                            <Lock className="w-4 h-4 text-cyan-400" />
                                            {isFreePlan ? "Activate Neural Access" : `Authorize $${currentPlanDetails.price} USD`}
                                        </button>
                                        <div className="flex items-center justify-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AES-256 Encrypted Junction</span>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

