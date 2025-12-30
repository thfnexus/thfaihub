"use client";

import { useState } from "react";
import { Check, Copy, X, Smartphone, MessageCircle, Send } from "lucide-react";

interface PaymentModalProps {
    planName: string;
    onClose: () => void;
}

export default function PaymentModal({ planName, onClose }: PaymentModalProps) {
    const [transactionId, setTransactionId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    // Payment Details
    const paymentDetails = {
        jazzcash: {
            title: "Adnan Mehmood",
            number: "0300 6764066"
        },
        easypaisa: {
            title: "Adnan Mehmood",
            number: "0300 6764066"
        },
        whatsapp: "923423209895" // Format for wa.me link
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        if (!transactionId.trim()) {
            setError("Please enter the Transaction ID.");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: planName.toUpperCase(),
                    transactionId: transactionId.trim()
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to submit request.");
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <div className="bg-white rounded-[40px] shadow-2xl p-8 max-w-md w-full relative overflow-hidden text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic">Request Submitted!</h3>
                        <p className="text-slate-600 font-medium mt-2">
                            We have received your request. Your plan will be activated after verification.
                        </p>
                    </div>

                    <a
                        href={`https://wa.me/${paymentDetails.whatsapp}?text=${encodeURIComponent(`Hi, I have paid for the ${planName} plan. Transaction ID: ${transactionId}. Please verify.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-xl shadow-green-500/20"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Verify on WhatsApp
                    </a>

                    <button
                        onClick={onClose}
                        className="text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-600"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-[30px] shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 right-0 z-10 p-4">
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100/80 backdrop-blur rounded-full hover:bg-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                            Upgrade to <span className="text-cyan-600">{planName}</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                            Manual Payment Method
                        </p>

                        <div className="mt-4 p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-center">
                            <p className="text-xs font-black uppercase tracking-widest text-cyan-600 mb-1">Total Amount</p>
                            <p className="text-3xl font-black text-cyan-900">
                                {planName.toUpperCase() === 'PREMIUM' ? '$40' : '$15'}
                            </p>
                            <p className="text-[10px] font-bold text-cyan-700/60 uppercase tracking-widest mt-1">
                                (Approx. {planName.toUpperCase() === 'PREMIUM' ? '11,200 PKR' : '4,200 PKR'})
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-black text-slate-900 uppercase tracking-wide">Transfer Details</span>
                        </div>

                        {/* JazzCash */}
                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">JazzCash</p>
                                <p className="text-lg font-bold text-slate-900">{paymentDetails.jazzcash.number}</p>
                                <p className="text-xs font-medium text-slate-500">{paymentDetails.jazzcash.title}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(paymentDetails.jazzcash.number)}
                                className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        {/* EasyPaisa */}
                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">EasyPaisa</p>
                                <p className="text-lg font-bold text-slate-900">{paymentDetails.easypaisa.number}</p>
                                <p className="text-xs font-medium text-slate-500">{paymentDetails.easypaisa.title}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(paymentDetails.easypaisa.number)}
                                className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                Transaction ID (TRX ID)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 84239102X"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? "Submitting..." : (
                                <>
                                    Submit for Verification
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
