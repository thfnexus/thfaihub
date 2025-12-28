import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-6 mt-auto text-slate-400">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase text-white">
                            THF AI <span className="text-blue-500 text-glow">Hub</span>
                        </Link>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-slate-500">
                            Strategic Career Intelligence Platform
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                        <p className="text-sm font-bold text-slate-300 tracking-wide">
                            Developed by{' '}
                            <Link
                                href="https://thfnexus.com"
                                target="_blank"
                                className="text-white font-black hover:text-blue-400 transition-all border-b border-white hover:border-blue-400"
                            >
                                THF NEXUS
                            </Link>
                        </p>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                            <Link href="/refund" className="hover:text-emerald-400 transition-colors">
                                Refund Policy
                            </Link>
                            <span className="text-slate-700">•</span>
                            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                                Privacy
                            </Link>
                            <span className="text-slate-700">•</span>
                            <Link href="/terms" className="hover:text-blue-400 transition-colors">
                                Terms
                            </Link>
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                            © 2026 THF NEXUS — All Rights Reserved
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-loose max-w-2xl mx-auto">
                        THF AI HUB is a strategic ecosystem of professional intelligence, delivering advanced neural solutions for career architecture,
                        education strategy, and global market growth. Engineered and published by the team at THF NEXUS.
                    </p>
                </div>
            </div>
        </footer>
    )
}
