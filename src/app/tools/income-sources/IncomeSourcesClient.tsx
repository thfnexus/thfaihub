'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Coins,
    Briefcase,
    Timer,
    ShieldAlert,
    Globe,
    TrendingUp,
    AlertCircle,
    ArrowRight,
    Loader2,
    DollarSign,
    Target,
    Zap,
    History,
    XCircle,
    Smartphone,
    Laptop
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateIncomeSources, type IncomeSourcesInput } from "./actions"

export default function IncomeSourcesClient() {
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<IncomeSourcesInput>({
        country: "",
        age: "",
        education: "Intermediate/High School",
        skills: "",
        internetAccess: "Laptop",
        dailyTime: "2-4 hours",
        riskLevel: "Medium",
        goalType: "Part-time income"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResults(null)

        const response = await generateIncomeSources(formData)

        if (response.success) {
            setResults(response.data)
            setTimeout(() => {
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } else {
            setError(response.error || "Something went wrong")
        }
        setLoading(false)
    }

    const educationLevels = [
        "Matric/O-Levels",
        "Intermediate/A-Levels",
        "Bachelor's Degree",
        "Master's or Higher",
        "No Formal Education"
    ]

    const timeOptions = [
        "1-2 hours",
        "2-4 hours",
        "4-8 hours",
        "Full-time (8+ hours)"
    ]

    const riskLevels = ["Low", "Medium", "High"]

    const goalTypes = [
        "Part-time income",
        "Full-time income",
        "Side hustle",
        "Long-term business"
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-widest mb-6"
                >
                    <DollarSign className="w-4 h-4" /> Personalized Earning Map
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">
                    Income <span className="text-blue-600">Sources</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                    Stop guessing. Get a data-backed roadmap to building income streams tailored to your 2026 reality.
                </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-24"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Country</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Pakistan, UAE, USA"
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Age</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="22"
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Education</label>
                                        <select
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm bg-white"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        >
                                            {educationLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Current Skills</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="e.g. Basic Graphic Design, Typing, English Speaking, Excel..."
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Internet Access</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Mobile', 'Laptop'].map((device) => (
                                            <button
                                                key={device}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, internetAccess: device })}
                                                className={cn(
                                                    "flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm uppercase",
                                                    formData.internetAccess === device
                                                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                                                        : "border-slate-100 bg-slate-50 text-slate-400 grayscale hover:grayscale-0"
                                                )}
                                            >
                                                {device === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                                                {device}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Daily Time</label>
                                        <select
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm bg-white"
                                            value={formData.dailyTime}
                                            onChange={(e) => setFormData({ ...formData, dailyTime: e.target.value })}
                                        >
                                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Risk Level</label>
                                        <div className="flex bg-slate-100 p-1 rounded-xl">
                                            {riskLevels.map(lvl => (
                                                <button
                                                    key={lvl}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, riskLevel: lvl })}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition-all",
                                                        formData.riskLevel === lvl
                                                            ? "bg-white text-slate-900 shadow-sm"
                                                            : "text-slate-400 hover:text-slate-600"
                                                    )}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Goal Type</label>
                                    <select
                                        className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm bg-white"
                                        value={formData.goalType}
                                        onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                                    >
                                        {goalTypes.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                            >
                                {loading ? (
                                    <>Generating Roadmap... <Loader2 className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <>Generate Income Map <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                            <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">Cost: 1 Neural Credit</p>
                        </form>
                    </motion.div>
                </div>

                {/* Results Section */}
                <div id="results" className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[400px] text-center"
                            >
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                    <Zap className="w-10 h-10 text-blue-600 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 italic uppercase">Analyzing Markets...</h3>
                                <p className="text-slate-500 font-medium">Mapping worldwide opportunities to your specific profile.</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4 text-red-600"
                            >
                                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                <p className="font-bold">{error}</p>
                            </motion.div>
                        )}

                        {results && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                {/* Reality Checks Alert */}
                                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ShieldAlert className="w-24 h-24 text-amber-900" />
                                    </div>
                                    <h3 className="text-xl font-black text-amber-900 mb-4 uppercase italic flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-amber-600" /> Reality Checks (Critical)
                                    </h3>
                                    <div className="grid gap-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-amber-800/60 tracking-widest mb-1">Saturation Warning</p>
                                                <p className="text-amber-900 text-sm font-medium">{results.realityChecks.saturation}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <History className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-amber-800/60 tracking-widest mb-1">Patience Required</p>
                                                <p className="text-amber-900 text-sm font-medium">{results.realityChecks.patience}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-red-600">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-red-100">
                                                <ShieldAlert className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-red-600/60 tracking-widest mb-1">Scam Alert Areas</p>
                                                <p className="text-red-700 text-sm font-black italic">{results.realityChecks.scamWarnings}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mindset Advice - Motivation First! */}
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Target className="w-32 h-32 text-blue-900" />
                                    </div>
                                    <h3 className="text-2xl font-black text-blue-900 mb-6 uppercase italic flex items-center gap-2">
                                        <Target className="w-6 h-6 text-blue-600" /> Your Success Mindset
                                    </h3>

                                    <div className="grid gap-6 relative z-10">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                                            <p className="text-xs font-black uppercase text-blue-600 tracking-widest mb-3">💪 Motivation</p>
                                            <p className="text-slate-900 text-base font-medium leading-relaxed italic">{results.mindsetAdvice.motivation}</p>
                                        </div>

                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                                            <p className="text-xs font-black uppercase text-purple-600 tracking-widest mb-3">🎯 Action Steps (Start This Week)</p>
                                            <p className="text-slate-900 text-sm font-medium leading-relaxed whitespace-pre-line">{results.mindsetAdvice.actionSteps}</p>
                                        </div>

                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                                            <p className="text-xs font-black uppercase text-emerald-600 tracking-widest mb-3">🧠 Success Mindset</p>
                                            <p className="text-slate-900 text-sm font-medium leading-relaxed whitespace-pre-line">{results.mindsetAdvice.successMindset}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Categories */}
                                <TimelineSection
                                    icon={<Zap className="w-5 h-5" />}
                                    title="Immediate Sources"
                                    subtitle="0–30 Days (Quick Cash & Entry)"
                                    color="blue"
                                    ideas={results.immediate}
                                />
                                <TimelineSection
                                    icon={<Target className="w-5 h-5" />}
                                    title="Mid-Term Tracks"
                                    subtitle="1–6 Months (Skill & Service Base)"
                                    color="purple"
                                    ideas={results.midTerm}
                                />
                                <TimelineSection
                                    icon={<TrendingUp className="w-5 h-5" />}
                                    title="Long-Term Assets"
                                    subtitle="6–24 Months (Scaling & Passive)"
                                    color="emerald"
                                    ideas={results.longTerm}
                                />

                                <div className="text-center pt-8">
                                    <button
                                        onClick={() => window.print()}
                                        className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center border border-slate-200 rounded-full px-6 py-2 gap-2 mx-auto"
                                    >
                                        Save as PDF
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {!loading && !results && !error && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-100 rounded-[3rem] text-center p-12">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Timer className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-400 uppercase italic">Awaiting Input</h3>
                                <p className="text-slate-300 max-w-xs mx-auto mt-2 font-medium">Fill out your profile to map your income journey for 2026.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

function TimelineSection({ title, subtitle, ideas, color, icon }: any) {
    const colorMap: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{title}</h3>
                    <p className="text-sm font-bold text-slate-500">{subtitle}</p>
                </div>
            </div>
            <div className="grid gap-6">
                {ideas.map((idea: any, i: number) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3">
                            <div className="bg-slate-50 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-slate-100">
                                {idea.earningRange}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex-1">
                                <h4 className="text-lg font-black text-slate-900 uppercase group-hover:text-blue-600 transition-colors mb-3 pr-20 underline decoration-blue-500/30 underline-offset-4">
                                    {idea.title}
                                </h4>

                                <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Briefcase className="w-4 h-4 text-blue-500" />
                                        <span className="font-bold">Skills:</span> <span className="font-medium text-slate-700">{idea.skillRequirement}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Timer className="w-4 h-4 text-orange-500" />
                                        <span className="font-bold">Time:</span> <span className="font-medium text-slate-700">{idea.timeInvestment}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <ShieldAlert className="w-4 h-4 text-red-500" />
                                        <span className="font-bold">Risk:</span> <span className="font-medium text-slate-700">{idea.riskLevel}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Globe className="w-4 h-4 text-emerald-500" />
                                        <span className="font-bold">Relevance:</span> <span className="font-medium text-slate-700">{idea.countryRelevance}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        <span className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Growth Potential</span>
                                        <p className="font-medium text-slate-600">{idea.growthPotential}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
