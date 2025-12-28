'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, AtSign, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react"

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push("/login")
            } else {
                const data = await res.json()
                setError(data.error || "Initialization Failed: System rejection.")
            }
        } catch (err) {
            setError("Link Error: Protocol failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 py-16 px-4">
            <div className="w-full max-w-lg">
                {/* Brand Header */}
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Nexus <span className="text-emerald-600">Signup</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest md:tracking-[0.3em] text-[10px]">
                        Initialize Your Professional Intelligence Identity
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-black uppercase tracking-wider">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity (Full Name)</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Handle (Username)</label>
                                <div className="relative group">
                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="johndoe123"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Junction (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="operator@thfnexus.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Authorization Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                    Initializing...
                                </>
                            ) : (
                                <>
                                    Establish Link
                                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-4 border-t border-slate-50 flex flex-col items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Existing Operator? <Link href="/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4 decoration-2">Access Portal</Link>
                        </p>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secure Neural Handshake Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
