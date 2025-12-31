"use client";

import { useState } from "react";
import { Check, Copy, X, Smartphone, MessageCircle, Send, FileText } from "lucide-react";
import { useSession } from "next-auth/react";

interface PaymentModalProps {
    planName: string;
    onClose: () => void;
}

export default function PaymentModal({ planName, onClose }: PaymentModalProps) {
    const { data: session } = useSession();

    // Payment Details
    const paymentDetails = {
        whatsapp: "923423209895" // Format for wa.me link
    };

    const isPremium = planName.toUpperCase() === 'PREMIUM';
    const priceUSD = isPremium ? '$40' : '$15';
    const pricePKR = isPremium ? '11,200 PKR' : '4,200 PKR';

    const generateInvoiceLink = () => {
        const email = session?.user?.email || "Unknown User";
        const message = `*INVOICE REQUEST*
--------------------------
*Plan:* ${planName.toUpperCase()}
*Price:* ${priceUSD} / ${pricePKR}
*User:* ${email}
--------------------------
I want to upgrade my account. Please send me the payment details so I can proceed.`;

        return `https://wa.me/${paymentDetails.whatsapp}?text=${encodeURIComponent(message)}`;
    };

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

                <div className="p-8 overflow-y-auto custom-scrollbar text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-200">
                            <FileText className="w-10 h-10 text-cyan-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                            Upgrade to <span className="text-cyan-600">{planName}</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">
                            Generate Invoice & Pay
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8 max-w-sm mx-auto">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                <span className="text-sm font-bold text-slate-600">Plan</span>
                                <span className="text-sm font-black text-slate-900 uppercase">{planName}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                <span className="text-sm font-bold text-slate-600">User</span>
                                <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{session?.user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-sm font-black text-slate-900">Total</span>
                                <div className="text-right">
                                    <span className="block text-lg font-black text-cyan-600">{priceUSD}</span>
                                    <span className="block text-[10px] font-bold text-slate-400">{pricePKR}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 font-medium mb-8 leading-relaxed px-4">
                        Click below to send this invoice to our official WhatsApp support.
                        We will provide you with payment details and upgrade your account manually.
                    </p>

                    <a
                        href={generateInvoiceLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Send Invoice on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
