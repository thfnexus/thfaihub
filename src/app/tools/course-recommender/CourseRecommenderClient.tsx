'use client'

import React, { useState } from 'react'
import {
    BookOpen,
    Target,
    TrendingUp,
    DollarSign,
    Star,
    Clock,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowRight,
    Zap,
    BarChart3,
    ShieldCheck,
    Award,
    Timer
} from 'lucide-react'
import { generateCourseRecommendations, type CourseRecommenderInput, type RecommendedCourse } from './actions'
import { cn } from '@/lib/utils'

interface CourseRecommenderClientProps {
    userCredits: number
}

export default function CourseRecommenderClient({ userCredits }: CourseRecommenderClientProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<RecommendedCourse[] | null>(null)
    const [formData, setFormData] = useState<CourseRecommenderInput>({
        currentSkills: '',
        targetRole: '',
        budgetLimit: 'Any',
        timeCommitment: '5-10 hours/week',
        platformPreference: 'Any',
        otherPlatform: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (userCredits < 1) {
            setError("Insufficient credits. Please upgrade your plan.")
            return
        }
        setLoading(true)
        setError(null)
        try {
            const res = await generateCourseRecommendations(formData)
            if (res.success && res.data) {
                setResults(res.data)
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            } else {
                setError(res.error || "Failed to generate recommendations.")
            }
        } catch (err) {
            setError("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Header section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <Award className="w-3 h-3" /> ROI & Quality Audited
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                    AI Course <span className="text-indigo-600">Recommender</span>
                </h1>
                <p className="text-slate-700 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-tight">
                    Audited recommendations for 2026. Stop wasting time on low-value certificates.
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    This AI Trained and published by THF NEXUS
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-700 border border-slate-200">
                        Available Credits: <span className="text-indigo-600">{userCredits}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        AI Quality Filter Active: Removing Generic Content
                    </div>
                </div>
            </div>

            <div className={cn(
                "grid lg:grid-cols-2 gap-8 md:gap-12 items-start transition-all duration-700",
                results ? "lg:grid-cols-[1fr_2fr]" : "lg:grid-cols-1 max-w-2xl mx-auto w-full px-2 md:px-0"
            )}>
                {/* Form Section */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 lg:sticky lg:top-12">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Current Skills
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Basic JS, Excel, Marketing Basics"
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-950 placeholder:text-slate-600"
                                value={formData.currentSkills}
                                onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                <Target className="w-3 h-3" /> Target Role / Goal
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. AI Engineer, Product Manager"
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-950 placeholder:text-slate-600"
                                value={formData.targetRole}
                                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Budget Limit</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm appearance-none text-slate-950"
                                    value={formData.budgetLimit}
                                    onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                                >
                                    <option value="Any">Any Budget</option>
                                    <option value="Free Only">Free Only</option>
                                    <option value="Under $50">Under $50</option>
                                    <option value="Under $200">Under $200</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Time / Week</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm appearance-none text-slate-950"
                                    value={formData.timeCommitment}
                                    onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                                >
                                    <option value="Under 5 hours/week">Under 5h</option>
                                    <option value="5-10 hours/week">5-10h</option>
                                    <option value="10-20 hours/week">10-20h</option>
                                    <option value="Full-time">Full-time</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 pb-4">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Platform Preference</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm appearance-none text-slate-950"
                                value={formData.platformPreference}
                                onChange={(e) => setFormData({ ...formData, platformPreference: e.target.value })}
                            >
                                <option value="Any">Mixed Platforms</option>
                                <option value="Coursera">Coursera Specialist</option>
                                <option value="Udemy">Udemy (Best Deals)</option>
                                <option value="edX">edX (University Level)</option>
                                <option value="YouTube">YouTube (Free Learning)</option>
                                <option value="LinkedIn Learning">LinkedIn Certification</option>
                                <option value="Local Bootcamps">Local/Live Bootcamps</option>
                                <option value="Other">Other (Specify below)</option>
                            </select>
                            {formData.platformPreference === 'Other' && (
                                <input
                                    required
                                    type="text"
                                    placeholder="Specify platform (e.g. Khan Academy)"
                                    className="w-full px-4 py-3 mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-950 placeholder:text-slate-600"
                                    value={formData.otherPlatform}
                                    onChange={(e) => setFormData({ ...formData, otherPlatform: e.target.value })}
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    Auditing Market Data...
                                </>
                            ) : (
                                <>
                                    <BarChart3 className="w-5 h-5" /> Calculate ROI & Audit
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {results && (
                    <div id="results-section" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {results.map((item, i) => (
                            <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col xl:flex-row">
                                {/* Left Quality Panel */}
                                <div className="bg-slate-900 p-8 xl:w-80 border-b xl:border-b-0 xl:border-r border-slate-800 space-y-6 flex flex-col justify-between text-white">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-2 py-1 rounded inline-block uppercase tracking-widest border border-indigo-500/30">
                                                {item.hostPlatform}
                                            </div>
                                            <div className="flex items-center gap-1 font-black text-amber-400">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-xl">{item.qualityScore}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {item.hostUniversity && (
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {item.hostUniversity}
                                                </p>
                                            )}
                                            <h2 className="text-2xl font-black text-white leading-[0.95] uppercase tracking-tighter italic">
                                                {item.name}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-slate-300 uppercase">Investment</p>
                                                <p className="text-sm font-bold text-white uppercase tracking-tighter">{item.cost}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg">
                                                <Clock className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-slate-300 uppercase">Duration</p>
                                                <p className="text-sm font-bold text-white uppercase tracking-tighter">{item.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-lg">
                                                <Award className="w-4 h-4 text-amber-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-slate-300 uppercase">Cert Value</p>
                                                <p className={cn(
                                                    "text-sm font-bold uppercase tracking-tighter",
                                                    item.certificateValue === 'High' ? "text-emerald-400" : "text-slate-100"
                                                )}>{item.certificateValue}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={item.officialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full px-5 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
                                    >
                                        Enroll Now <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>

                                {/* Right Audit Area */}
                                <div className="p-8 flex-1 space-y-8 bg-white relative">
                                    {/* ROI Analysis Header */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col justify-between">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Expected ROI</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter italic leading-none">{item.roiMetrics.salaryPotential}</p>
                                        </div>
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Market Demand</p>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    item.roiMetrics.marketDemand === 'High' ? "bg-emerald-500" : "bg-amber-500"
                                                )} />
                                                <p className="text-lg font-black text-slate-900 tracking-tighter uppercase">{item.roiMetrics.marketDemand}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-slate-900 rounded-2xl flex flex-col justify-between">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Job Readiness</p>
                                            <p className="text-xl font-black text-white italic tracking-tighter uppercase">{item.timeToOutcome}</p>
                                        </div>
                                    </div>

                                    {/* Pros & Cons Audit */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strategic Pros
                                            </h4>
                                            <p className="text-sm text-slate-700 font-bold leading-relaxed italic pr-4">"{item.pros}"</p>

                                            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                                                <p className="text-[10px] font-black text-slate-700 uppercase">Core Curriculum Outcomes</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.curriculumHighlights.map((topic, idx) => (
                                                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200 uppercase tracking-tighter">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 border-l-0 md:border-l border-slate-100 md:pl-8">
                                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-500" /> Honest Audit (Cons)
                                            </h4>
                                            <p className="text-sm text-slate-700 font-bold leading-relaxed italic pr-4 border-l-2 border-red-500 pl-4 bg-red-50/30 py-2 rounded-r-xl">"{item.cons}"</p>

                                            <div className="bg-slate-900 p-5 rounded-2xl mt-4 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />
                                                <p className="text-[10px] font-black text-slate-200 uppercase flex items-center gap-1 mb-2 relative">
                                                    <TrendingUp className="w-3 h-3 text-indigo-400" /> Career Advisory
                                                </p>
                                                <p className="text-xs text-white font-bold leading-relaxed relative">
                                                    Ranked <span className="text-indigo-400">{item.roiMetrics.valueForMoney}</span> for {formData.targetRole} pivots in 2026.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Audit Footer */}
                        <div className="p-10 bg-indigo-950 rounded-[40px] border border-indigo-800 text-center space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <ShieldCheck className="w-64 h-64 text-indigo-400" />
                            </div>
                            <div className="relative space-y-3">
                                <TrendingUp className="w-10 h-10 text-indigo-400 mx-auto" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">ROI Audit Protocol (v2.6)</h3>
                                <p className="text-sm text-indigo-300 font-medium max-w-2xl mx-auto leading-relaxed">
                                    Our AI auditor cross-references data from Glassdoor, LinkedIn Hiring Trends, and 2026 Skills Reports. Salary Potential estimates are based on entry-level pivots to junior-mid roles in the target field.
                                </p>
                            </div>
                            <div className="flex justify-center gap-8 pt-4 border-t border-indigo-900 relative">
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-Time Auditing</div>
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Scam Course Removal</div>
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Market Verified</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
