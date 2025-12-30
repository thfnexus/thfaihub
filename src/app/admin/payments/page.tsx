import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Check, X, Clock } from "lucide-react";

async function handlePayment(formData: FormData) {
    "use server"
    const requestId = formData.get("requestId") as string;
    const action = formData.get("action") as string;
    const userId = formData.get("userId") as string;
    const plan = formData.get("plan") as string;

    if (action === "approve") {
        const planDefaults: Record<string, number> = {
            'PRO': 80,
            'PREMIUM': 250
        };
        const credits = planDefaults[plan] || 0;

        // Transaction: Update PaymentRequest AND User
        await prisma.$transaction([
            prisma.paymentRequest.update({
                where: { id: requestId },
                data: { status: "APPROVED" }
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    plan: plan as any,
                    credits: credits
                }
            })
        ]);
    } else if (action === "reject") {
        await prisma.paymentRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" }
        });
    }

    revalidatePath("/admin/payments");
}

export default async function AdminPaymentsPage() {
    const requests = await prisma.paymentRequest.findMany({
        where: { status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                Payment <span className="text-blue-600">Requests</span>
            </h1>

            <div className="bg-white rounded-[30px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">User</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Plan Requested</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">TRX ID</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                                        No pending payment requests.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="font-bold text-slate-900">{req.user.name || "No Name"}</div>
                                            <div className="text-xs font-medium text-slate-400">{req.user.email}</div>
                                        </td>
                                        <td className="p-6">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-cyan-100 text-cyan-700">
                                                {req.plan}
                                            </span>
                                        </td>
                                        <td className="p-6 font-mono text-sm font-bold text-slate-700">
                                            {req.transactionId}
                                        </td>
                                        <td className="p-6 text-sm font-medium text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <form action={handlePayment} className="flex items-center justify-end gap-2">
                                                <input type="hidden" name="requestId" value={req.id} />
                                                <input type="hidden" name="userId" value={req.userId} />
                                                <input type="hidden" name="plan" value={req.plan} />

                                                <button
                                                    name="action"
                                                    value="reject"
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    name="action"
                                                    value="approve"
                                                    className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
