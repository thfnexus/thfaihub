import { Shield, Lock, Eye, FileText, Server, Cpu, HeartHandshake, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#F4F7FB] py-12 md:py-24 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <Shield className="w-3.5 h-3.5" /> Legal Shield Protocol
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Privacy <span className="text-blue-600">Policy.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-xs max-w-xl mx-auto leading-relaxed">
                        How we protect your neural profile and professional data within the THF Nexus.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-16 rounded-[50px] shadow-2xl relative overflow-hidden">
                    <div className="space-y-16 relative z-10">
                        {/* Legal Business Entity */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">Legal Business Entity</h3>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                This Privacy Policy outlines how **THF AI HUB** ("the company", "we", "us", or "our") collects, uses, and protects your information. **THF AI HUB** is the legal entity responsible for your data.
                            </p>
                        </section>

                        {/* Data Storage */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                    <Server className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">Data Storage & Sovereignty</h3>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Your data is stored in Tier-IV secure data centers with AES-256 military-grade encryption. We maintain decentralized backups to ensure your career history and neural profile remain intact and available only to you.
                            </p>
                        </section>

                        {/* AI Usage */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Cpu className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">AI & Neural Processing</h3>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Our AI models utilize your data to generate personalized career roadmaps and educational suggestions. This processing is performed in a **zero-knowledge** environment, meaning our models do not "share" your personal details with other users.
                            </p>
                        </section>

                        {/* No Resale */}
                        <section className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] space-y-4">
                            <div className="flex items-center gap-3 text-blue-700">
                                <HeartHandshake className="w-6 h-6 focus:text-blue-600" />
                                <h3 className="text-xl font-black uppercase italic tracking-tight">No-Resale Guarantee</h3>
                            </div>
                            <p className="text-blue-900/70 font-bold text-sm leading-relaxed uppercase tracking-wide">
                                THF AI Hub does NOT sell, rent, or trade your personal data to third-party advertisers or recruiters. Your professional identity is not a product; it is a legacy we help you build.
                            </p>
                        </section>

                        {/* Email Safety */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">Email & Profile Security</h3>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We utilize multi-factor authentication and tokenized sessions to keep your account safe. Your email address is used strictly for authentication, system notifications, and requested career updates.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Payment Gateway Compliant
                            </div>
                            <span>Last Updated: Dec 2025</span>
                            <span>Version 2.1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
