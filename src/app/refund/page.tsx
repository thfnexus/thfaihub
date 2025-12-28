import { DollarSign, Clock, CheckCircle, XCircle, RefreshCw, AlertCircle, Shield, Calendar } from "lucide-react"

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-[#F4F7FB] py-12 md:py-24 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <RefreshCw className="w-3.5 h-3.5" /> Payment Nexus Protocol
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Refund <span className="text-emerald-600">Policy.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-xs max-w-xl mx-auto leading-relaxed">
                        Transparent financial operations and subscriber protection framework.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-16 rounded-[50px] shadow-2xl relative overflow-hidden">
                    <div className="space-y-16 relative z-10">
                        {/* 7-Day Money Back */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">7-Day Money-Back Guarantee</h3>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We offer a <span className="font-black text-emerald-600">7-day unconditional refund window</span> for all paid subscriptions (Basic, Pro, Enterprise). If you feel THF AI Hub is not meeting your expectations, simply request a full refund within the first 7 days of activation.
                            </p>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
                                <p className="text-emerald-900 font-bold text-sm uppercase tracking-widest flex items-start gap-3">
                                    <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    Refund processing completes within <span className="text-emerald-600">3-5 business days</span> to your original payment method.
                                </p>
                            </div>
                        </section>

                        {/* Eligibility Criteria */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">Eligibility Requirements</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        <span className="font-black text-slate-900">First-time subscribers</span> – Must not have previously claimed a refund for the same plan tier.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        <span className="font-black text-slate-900">Active subscription status</span> – Refund requests must be made while the subscription is still active.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        <span className="font-black text-slate-900">Within 7-day window</span> – Request submitted before the 7-day period expires from initial payment.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Non-Refundable Cases */}
                        <section className="p-10 bg-slate-900 rounded-[40px] text-white space-y-6">
                            <div className="flex items-center gap-3 text-red-400">
                                <XCircle className="w-6 h-6" />
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Non-Refundable Scenarios</h3>
                            </div>
                            <div className="space-y-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
                                <p className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Subscription renewals after 7 days</p>
                                <p className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Downgraded or canceled mid-cycle plans</p>
                                <p className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Partial month usage (prorated refunds not available)</p>
                                <p className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Violations of Terms of Service or Fair Use Policy</p>
                            </div>
                        </section>

                        {/* How to Request */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">How to Request a Refund</h3>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-3xl p-8 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 mb-1">Navigate to Settings</p>
                                        <p className="text-slate-600 text-sm font-medium">Go to your Account Settings → Subscription → Manage Plan</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 mb-1">Submit Refund Request</p>
                                        <p className="text-slate-600 text-sm font-medium">Click "Request Refund" and provide optional feedback (helps us improve!)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 mb-1">Wait for Processing</p>
                                        <p className="text-slate-600 text-sm font-medium">Refunds are processed within 3-5 business days to your original payment method</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Alternative Support */}
                        <section className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] space-y-4">
                            <div className="flex items-center gap-3 text-blue-700">
                                <AlertCircle className="w-6 h-6" />
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Need Help Instead?</h3>
                            </div>
                            <p className="text-blue-900/70 font-bold text-sm leading-relaxed uppercase tracking-wide">
                                Before requesting a refund, consider reaching out to our <span className="text-blue-600">support team</span>. We're committed to resolving technical issues, addressing feature requests, and helping you maximize the value of your subscription.
                            </p>
                            <div className="pt-4">
                                <a href="/support" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    Contact Support <Shield className="w-4 h-4" />
                                </a>
                            </div>
                        </section>

                        <div className="pt-12 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Secure Payment Gateway
                            </div>
                            <span>Last Updated: Dec 2025</span>
                            <span>Processing Time: 3-5 Days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
