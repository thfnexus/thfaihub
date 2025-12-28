import Link from 'next/link'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                    Page Not Found
                </h1>

                <p className="text-slate-500 mb-8 text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
