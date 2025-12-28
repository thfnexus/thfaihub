'use client'

import { useActionState } from "react"
import { updateProfile } from "./actions"
import { User, Mail, ShieldCheck, Save, Fingerprint, Check, AlertCircle, RefreshCw, CreditCard, DollarSign } from "lucide-react"

const initialState: { error: string, success: string } = {
    error: "",
    success: ""
}

export default function SettingsForm({ user }: { user: any }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)

    return (
        <div className="min-h-screen bg-[#F4F7FB] py-12 md:py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Fingerprint className="w-3 h-3" /> Identity Hub
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
                            Account <span className="text-blue-600">Settings</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            Configure your neural profile and system parameters
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Settings Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>

                            <form action={formAction} className="space-y-8 relative z-10">
                                {state?.error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {state.error}
                                    </div>
                                )}
                                {state?.success && (
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                        <Check className="w-5 h-5 flex-shrink-0" />
                                        {state.success}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                <User className="w-3 h-3 text-blue-600" /> Full Identity Name
                                            </label>
                                            <input
                                                name="name"
                                                type="text"
                                                defaultValue={user.name || ""}
                                                placeholder="Enter your full name"
                                                className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                                required
                                            />
                                        </div>

                                        {/* Username Field */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                <Fingerprint className="w-3 h-3 text-blue-600" /> Nexus Username
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">@</span>
                                                <input
                                                    name="username"
                                                    type="text"
                                                    defaultValue={user.username || ""}
                                                    placeholder="username"
                                                    className="w-full pl-10 pr-5 py-4 border-2 border-slate-100 rounded-2xl bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Field (Disabled) */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Mail className="w-3 h-3 text-slate-400" /> Primary Neural Network Email
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full px-5 py-4 border-2 border-slate-50 rounded-2xl bg-slate-50 text-slate-400 cursor-not-allowed font-bold"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold italic ml-1">Contact support to modify your primary email address.</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="group w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isPending ? (
                                            "Updating Sync..."
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                                Commit Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Subscription Management Section */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden mt-8">
                            <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>

                            <div className="space-y-8 relative z-10">
                                {/* Header */}
                                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900">
                                            Subscription Management
                                        </h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Manage your neural subscription plan
                                        </p>
                                    </div>
                                </div>

                                {/* Current Plan */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <RefreshCw className="w-3 h-3 text-emerald-600" /> Current Plan
                                        </label>
                                        <div className="px-5 py-4 border-2 border-slate-100 rounded-2xl bg-white font-black text-slate-700 shadow-sm flex items-center justify-between">
                                            <span className="text-emerald-600 uppercase text-lg italic">{user.plan || "FREE"}</span>
                                            {user.plan && user.plan !== "FREE" && (
                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-black">ACTIVE</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            <Fingerprint className="w-3 h-3 text-blue-600" /> Account Status
                                        </label>
                                        <div className="px-5 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold text-slate-700 shadow-sm">
                                            <span className="text-blue-600">Active Subscriber</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row gap-4 pt-4">
                                    <a
                                        href="/pricing"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Upgrade Plan
                                    </a>
                                    <a
                                        href="/refund"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-emerald-200 text-emerald-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Request Refund
                                    </a>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mt-6">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-blue-900">7-Day Money-Back Guarantee</p>
                                            <p className="text-xs font-medium text-blue-700 leading-relaxed">
                                                Not satisfied? Request a full refund within 7 days of your subscription. Visit our{" "}
                                                <a href="/refund" className="underline hover:text-blue-900">Refund Policy</a> for details.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <h3 className="font-black text-lg uppercase italic tracking-tight mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-400" /> Security Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                                    <span className="text-slate-400 font-bold tracking-widest uppercase">2FA Auth</span>
                                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md font-black">DISABLED</span>
                                </div>
                                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                                    <span className="text-slate-400 font-bold tracking-widest uppercase">Last Sync</span>
                                    <span className="text-white font-bold">{new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold tracking-widest uppercase">Account Level</span>
                                    <span className="text-blue-400 font-black">{user.plan || "CORE"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-xl">
                            <h3 className="font-black text-lg text-slate-900 uppercase italic tracking-tight mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-600" /> Pro-Tip
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                                "Keeping your full name updated helps the AI Counselor provide more geographically relevant career paths and networking opportunities."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
