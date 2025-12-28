'use client'

import { useState, useEffect } from 'react'
import {
    CircleDollarSign,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Globe,
    GraduationCap,
    BookOpen,
    Calendar,
    ShieldCheck,
    ExternalLink,
    Timer,
    Info,
    AlertTriangle,
    XCircle,
    Target
} from 'lucide-react'
import { generateScholarshipAnalysis, type ScholarshipPlannerInput, type ScholarshipMatch } from './actions'
import { cn } from '@/lib/utils'

interface ScholarshipPlannerClientProps {
    userCredits: number
}

export default function ScholarshipPlannerClient({ userCredits }: ScholarshipPlannerClientProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<ScholarshipMatch[] | null>(null)
    const [formData, setFormData] = useState<ScholarshipPlannerInput>({
        citizenship: '',
        educationLevel: '12th Grade / A-Levels',
        otherEducationLevel: '',
        targetDegree: 'Bachelor',
        otherTargetDegree: '',
        fieldOfStudy: '',
        destinationCountry: '',
        fundingPreference: 'Any',
        applicationStage: 'Just exploring',
        languageProficiency: 'None',
        preferredIntake: 'Any'
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
            const response = await generateScholarshipAnalysis(formData)
            if (response.success) {
                setResults(response.data || [])
            } else {
                setError(response.error || "Something went wrong")
            }
        } catch (err) {
            setError("Failed to connect to the server. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
                    <CircleDollarSign className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
                    AI Scholarship <span className="text-emerald-600">Planner</span>
                </h1>
                <p className="text-slate-700 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-tight">
                    Verified, real-world data only. No guessing. No inventing. Protect your future with accurate planning.
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    This AI Trained and published by THF NEXUS
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-700 border border-slate-200">
                        Available Credits: <span className="text-emerald-600">{userCredits}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Live Research Mode Active
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className={cn(
                    "lg:col-span-4",
                    results ? "hidden lg:block" : "lg:col-span-12 max-w-3xl mx-auto w-full px-2 md:px-0"
                )}>
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Citizenship
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Pakistan"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                        value={formData.citizenship}
                                        onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <GraduationCap className="w-3 h-3" /> Current Level
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none"
                                        value={formData.educationLevel}
                                        onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                                    >
                                        <option value="9th Grade">9th Grade</option>
                                        <option value="10th Grade / Matric">10th Grade / Matric</option>
                                        <option value="11th Grade / FSc-1">11th Grade / FSc-1</option>
                                        <option value="12th Grade / A-Levels">12th Grade / A-Levels</option>
                                        <option value="Bachelor Student">Bachelor Student</option>
                                        <option value="Bachelor Graduate">Bachelor Graduate</option>
                                        <option value="Master Student">Master Student</option>
                                        <option value="Other">Other (Specify below)</option>
                                    </select>
                                    {formData.educationLevel === 'Other' && (
                                        <input
                                            required
                                            type="text"
                                            placeholder="Specify your level"
                                            className="w-full px-4 py-3 mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                            value={formData.otherEducationLevel}
                                            onChange={(e) => setFormData({ ...formData, otherEducationLevel: e.target.value })}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <Target className="w-3 h-3" /> Target Degree
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none"
                                        value={formData.targetDegree}
                                        onChange={(e) => setFormData({ ...formData, targetDegree: e.target.value })}
                                    >
                                        <option value="Bachelor">Bachelor</option>
                                        <option value="Master">Master</option>
                                        <option value="PhD">PhD</option>
                                        <option value="Diploma / Course">Diploma / Course</option>
                                        <option value="Other">Other (Specify below)</option>
                                    </select>
                                    {formData.targetDegree === 'Other' && (
                                        <input
                                            required
                                            type="text"
                                            placeholder="Specify target degree"
                                            className="w-full px-4 py-3 mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                            value={formData.otherTargetDegree}
                                            onChange={(e) => setFormData({ ...formData, otherTargetDegree: e.target.value })}
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Field
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Computer Science"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                        value={formData.fieldOfStudy}
                                        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Destination Country</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. USA, UK, or Germany"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                                    value={formData.destinationCountry}
                                    onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Funding Type Preference</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none"
                                        value={formData.fundingPreference}
                                        onChange={(e) => setFormData({ ...formData, fundingPreference: e.target.value })}
                                    >
                                        <option value="Fully Funded">Fully Funded</option>
                                        <option value="Partial Funded">Partial Funded</option>
                                        <option value="Tuition Only">Tuition Only</option>
                                        <option value="Any">Any</option>
                                    </select>
                                    <p className="text-[9px] text-slate-500 font-medium">This will not affect eligibility. Used only for guidance.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Preparation Stage</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none"
                                        value={formData.applicationStage}
                                        onChange={(e) => setFormData({ ...formData, applicationStage: e.target.value })}
                                    >
                                        <option value="Just exploring">Just exploring</option>
                                        <option value="Preparing documents">Preparing documents</option>
                                        <option value="Ready to apply">Ready to apply</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">English Level</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none"
                                    value={formData.languageProficiency}
                                    onChange={(e) => setFormData({ ...formData, languageProficiency: e.target.value })}
                                >
                                    <option value="None">None / No Test yet</option>
                                    <option value="IELTS 6.0">IELTS 6.0</option>
                                    <option value="IELTS 7.0+">IELTS 7.0+</option>
                                    <option value="TOEFL 90+">TOEFL 90+</option>
                                </select>
                            </div>

                            <div className="space-y-2 pb-4">
                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Preferred Intake</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm appearance-none"
                                    value={formData.preferredIntake}
                                    onChange={(e) => setFormData({ ...formData, preferredIntake: e.target.value })}
                                >
                                    <option value="Any">Any Intake</option>
                                    <option value="Fall 2026">Fall 2026</option>
                                    <option value="Spring 2026">Spring 2026</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Filtering Records...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Find Scholarships
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {results !== null && (
                    <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {results.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
                                <div className="inline-flex p-4 bg-red-50 rounded-2xl">
                                    <XCircle className="w-12 h-12 text-red-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic">No Matches Found</h3>
                                <p className="text-slate-500 font-medium max-w-md mx-auto">
                                    Based on verified data, no active scholarships currently match your profile. Check back later for database updates.
                                </p>
                            </div>
                        ) : (
                            results.map((item, i) => (
                                <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                    {/* Left Info Panel */}
                                    <div className="bg-slate-50 p-8 md:w-80 border-b md:border-b-0 md:border-r border-slate-100 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                                        <BookOpen className="w-3 h-3" /> {item.hostUniversity}
                                                    </div>
                                                    <div className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                                                        {item.fundingType}
                                                    </div>
                                                </div>
                                                <h2 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tighter italic">
                                                    {item.name}
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Deadline</p>
                                                    <p className="text-sm font-bold text-slate-800">{item.deadline}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Timer className="w-4 h-4 text-slate-400" />
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Time Left</p>
                                                    <p className={cn(
                                                        "text-sm font-bold",
                                                        item.deadlineWarning.includes("Urgent") ? "text-red-500" : "text-emerald-600"
                                                    )}>{item.timeLeft}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={item.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-slate-50 transition-colors"
                                        >
                                            Official Source <ExternalLink className="w-3.5 h-3.5" />
                                        </a>

                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 italic">
                                                Verified: {item.lastVerified}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Content Area */}
                                    <div className="p-8 flex-1 space-y-8">
                                        {/* Deadline Warning Banner */}
                                        {item.deadlineWarning.includes("Urgent") && (
                                            <div className="py-3 px-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-widest">
                                                <AlertTriangle className="w-4 h-4" />
                                                {item.deadlineWarning}
                                            </div>
                                        )}

                                        {/* Eligibility Section */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Eligibility Breakdown
                                            </h4>
                                            <div className="grid gap-4">
                                                <div className="p-5 bg-emerald-50/50 rounded-2xl space-y-1">
                                                    <p className="text-[10px] font-black text-emerald-700 uppercase">You Qualify Because:</p>
                                                    <p className="text-sm text-slate-800 font-medium italic">"{item.eligibilityExplanation.qualifications}"</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase">Rejection Risks:</p>
                                                        <p className="text-xs text-slate-700 font-bold leading-relaxed">{item.eligibilityExplanation.rejectionRisks}</p>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1 border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase">Critical Requirements:</p>
                                                        <p className="text-xs text-slate-700 font-bold leading-relaxed">{item.eligibilityExplanation.criticalRequirements}</p>
                                                    </div>
                                                </div>

                                                {/* Required Tests Section - High Impact for Students */}
                                                <div className="p-6 bg-slate-900 rounded-2xl border-2 border-emerald-500/30 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                                        <BookOpen className="w-16 h-16 text-emerald-500" />
                                                    </div>
                                                    <div className="relative space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-emerald-500 rounded-lg">
                                                                <Target className="w-4 h-4 text-white" />
                                                            </div>
                                                            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Mandatory Entrance Tests</p>
                                                        </div>
                                                        <p className="text-lg font-black text-white leading-tight">
                                                            {item.requiredTests}
                                                        </p>
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                                Critical Pathway for 2026 Admissions
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Honest Advisory */}
                                        <div className="bg-slate-900 rounded-3xl p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 text-emerald-500 opacity-10">
                                                <Info className="w-24 h-24" />
                                            </div>
                                            <div className="relative space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Senior Data Advisory</h4>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                        item.honestAdvisory.realisticChance.toLowerCase().includes("realistic")
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-red-500 text-white"
                                                    )}>
                                                        {item.honestAdvisory.realisticChance}
                                                    </span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase">Profile Weakness</p>
                                                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{item.honestAdvisory.weakPoints}</p>
                                                    </div>
                                                    <div className="p-4 bg-slate-800 rounded-2xl border-l-4 border-emerald-500">
                                                        <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Fix Before Applying</p>
                                                        <p className="text-sm text-white font-bold leading-relaxed italic">{item.honestAdvisory.fixBeforeApplying}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Static Footer Warning */}
                        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-2">
                            <p className="text-xs font-black text-red-500 uppercase tracking-widest">Live Integrity Protocol</p>
                            <p className="text-xs text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                                Our AI performs live cross-referencing of global university data. While information is updated frequently, always check the official university portal before proceeding with an application.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
