'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Access Denied: Invalid authentication parameters.")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch (err) {
            setError("Junction Error: System connection failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Brand Header */}
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Nexus <span className="text-cyan-600">Login</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest md:tracking-[0.3em] text-[10px]">
                        Access Your Professional Intelligence Hub
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-black uppercase tracking-wider">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Junction (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="operator@thfnexus.com"
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-cyan-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Authorization Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:border-cyan-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
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
                                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Establish Link
                                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-4 border-t border-slate-50 flex flex-col items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            New Operator? <Link href="/signup" className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4 decoration-2">Initialize Account</Link>
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
