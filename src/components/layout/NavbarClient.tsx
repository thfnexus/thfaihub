'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Coins, Settings, LogOut, User, ChevronDown, BookOpen, Info, Shield, Scale, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavbarClientProps {
    session: any
    userCredits?: number
    isAdmin: boolean
    logoutAction: () => Promise<void>
}

export default function NavbarClient({ session, userCredits: initialCredits, isAdmin: initialIsAdmin, logoutAction }: NavbarClientProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [credits, setCredits] = useState<number | undefined>(initialCredits)
    const [isAdmin, setIsAdmin] = useState(initialIsAdmin)

    // Fetch fresh data client-side to avoid build-time DB connection issues

    useEffect(() => {
        if (session?.user) {
            fetch('/api/user/me')
                .then(res => res.json())
                .then(data => {
                    if (data.credits !== undefined) setCredits(data.credits)
                    if (data.role) setIsAdmin(data.role === 'ADMIN')
                })
                .catch(err => console.error("Failed to fetch user data", err))
        }
    }, [session])

    const toggleMenu = () => setIsOpen(!isOpen)

    const resources = [
        { name: "About Us", href: "/about", icon: <Info className="w-4 h-4" /> },
        { name: "How It Works", href: "/how-it-works", icon: <HelpCircle className="w-4 h-4" /> },
        { name: "Pricing Explained", href: "/pricing-explained", icon: <BookOpen className="w-4 h-4" /> },
        { name: "Privacy Policy", href: "/privacy", icon: <Shield className="w-4 h-4" /> },
        { name: "Terms of Service", href: "/terms", icon: <Scale className="w-4 h-4" /> },
    ]

    return (
        <nav className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50 text-slate-700 supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 font-black text-xl italic tracking-tighter text-slate-900">
                    <span>THF AI <span className="text-blue-600">Hub</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600">
                        Home
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="relative group"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600 outline-none h-16">
                            Company <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", dropdownOpen ? "rotate-180" : "")} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-3xl shadow-2xl py-4 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {resources.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                                    >
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                                            {item.icon}
                                        </div>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/pricing" className="text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600">
                        Pricing
                    </Link>
                    <Link href="/support" className="text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600">
                        Support
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-4">
                            {credits !== undefined && (
                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    <Coins className="w-3 h-3" /> {credits}
                                </div>
                            )}
                            <Link href="/profile" className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            <Link href="/settings" className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-500">
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={() => logoutAction()}
                                className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-600">
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="p-2 text-slate-900 hover:text-blue-600 transition-colors">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-2xl p-6 space-y-6 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-1 max-h-[calc(100vh-4rem)] overflow-y-auto pb-20">
                    <Link href="/" onClick={toggleMenu} className="block text-sm font-bold uppercase tracking-widest hover:text-blue-600">Home</Link>

                    {/* Mobile Dropdown Section */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</p>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            {resources.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={toggleMenu}
                                    className="flex items-center gap-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-600"
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link href="/pricing" onClick={toggleMenu} className="block text-sm font-bold uppercase tracking-widest hover:text-blue-600">Pricing</Link>
                    <Link href="/support" onClick={toggleMenu} className="block text-sm font-bold uppercase tracking-widest hover:text-blue-600">Support</Link>
                    {session ? (
                        <>
                            {credits !== undefined && (
                                <div className="flex items-center gap-2 text-sm font-black text-yellow-600 uppercase tracking-widest">
                                    <Coins className="w-4 h-4" /> Bal: {credits}
                                </div>
                            )}
                            <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-blue-600">
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            <Link href="/settings" onClick={toggleMenu} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-blue-600">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                            {isAdmin && (
                                <div className="space-y-3 pt-2 border-t border-slate-100/50">
                                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Admin Controls</p>
                                    <div className="grid grid-cols-1 gap-4 pl-2">
                                        <Link href="/admin" onClick={toggleMenu} className="block text-sm font-bold uppercase tracking-widest hover:text-blue-600">Dashboard</Link>
                                        <Link href="/admin/users" onClick={toggleMenu} className="block text-sm font-bold uppercase tracking-widest hover:text-blue-600">User Management</Link>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    logoutAction()
                                    toggleMenu()
                                }}
                                className="flex items-center justify-center gap-2 w-full py-4 border border-red-100 text-red-500 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 pt-2">
                            <Link href="/login" onClick={toggleMenu} className="text-center py-4 border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50">Login</Link>
                            <Link href="/signup" onClick={toggleMenu} className="text-center py-4 bg-blue-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}
