'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"

interface DeleteUserButtonProps {
    userId: string
    userEmail: string
    isSuspended: boolean
    className?: string
}

export default function DeleteUserButton({ userId, userEmail, isSuspended, className }: DeleteUserButtonProps) {
    const [deleting, setDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to delete user")
            }

            router.refresh()
            // If we are on the detail page (which we might be), we should probably redirect to the list
            // But if we are on the list page, refresh is enough.
            // Let's assume list usage primarily, or simple refresh. 
            // If current path includes userId, we should push to users list.
            if (window.location.pathname.includes(userId)) {
                router.push("/admin/users")
            } else {
                router.refresh()
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete")
            setDeleting(false)
            setShowConfirm(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 space-y-4 transform scale-100 transition-all">
                    <div className="flex items-center gap-3 text-red-600">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-lg uppercase tracking-tight">Confirm Deletion</h3>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-600">
                            Are you sure you want to delete <span className="text-slate-900">{userEmail}</span>?
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                            This action is irreversible. All data, credits, and history will be permanently removed.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={() => { setShowConfirm(false); setDeleting(false); }}
                            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all ${className}`}
            title="Delete User"
        >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete</span>
        </button>
    )
}
