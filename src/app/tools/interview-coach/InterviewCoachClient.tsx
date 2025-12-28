'use client'

import { useState } from 'react'
import {
    UserCheck,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    Target,
    ListChecks,
    Users,
    TrendingUp,
    Info,
    HelpCircle,
    BookOpen,
    Clock,
    Zap,
    Trophy
} from 'lucide-react'
import { generateInterviewCoachAnalysis, type InterviewCoachInput, type InterviewAnalysisResponse } from './actions'
import { cn } from '@/lib/utils'

interface InterviewCoachClientProps {
    userCredits: number
}

export default function InterviewCoachClient({ userCredits }: InterviewCoachClientProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<InterviewAnalysisResponse | null>(null)
    const [formData, setFormData] = useState<InterviewCoachInput>({
        jobRole: '',
        country: '',
        experienceLevel: 'Fresh',
        companyName: ''
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
            const response = await generateInterviewCoachAnalysis(formData)
            if (response.success && response.data) {
                setResult(response.data)
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
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
                    <UserCheck className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
                    AI Interview <span className="text-red-600">Coach</span>
                </h1>
                <p className="text-slate-700 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-tight">
                    Prepare for 2026 market standards. Decisive, market-backed guidance from senior hiring consultants.
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    This AI Trained and published by THF NEXUS
                </p>
                <div className="flex justify-center">
                    <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-700 border border-slate-200">
                        Available Credits: <span className="text-red-600">{userCredits}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className={cn(
                    "lg:col-span-4",
                    result ? "hidden lg:block" : "lg:col-span-12 max-w-2xl mx-auto w-full px-2 md:px-0"
                )}>
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 lg:sticky lg:top-24">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Target Job Role</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-slate-950 placeholder:text-slate-600"
                                    value={formData.jobRole}
                                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Country</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. United Kingdom"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-slate-950 placeholder:text-slate-600"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Experience Level</label>
                                <select
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-slate-950 appearance-none"
                                    value={formData.experienceLevel}
                                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Fresh">Fresh Graduate</option>
                                    <option value="Junior">Junior (1-2 years)</option>
                                    <option value="Mid">Mid-Level (3-5 years)</option>
                                    <option value="Senior">Senior (5+ years)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Company Name (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google, Meta, or Startup"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-slate-950 placeholder:text-slate-600"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 disabled:bg-slate-400 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Market...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Get Prep Guide
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
                {result && (
                    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {/* 1. Role Analysis */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-red-50 p-6 border-b border-slate-100 flex items-center gap-4">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <Briefcase className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase italic">Step 1: Role Analysis</h2>
                            </div>
                            <div className="p-8 grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Core Responsibilities</h3>
                                    <ul className="space-y-2">
                                        {result.roleAnalysis.responsibilities.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Demanded Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.roleAnalysis.demandedSkills.technical.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase">
                                                    {skill}
                                                </span>
                                            ))}
                                            {result.roleAnalysis.demandedSkills.soft.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold uppercase">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Industry Trends (2026)</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.roleAnalysis.industryTrends.map((trend, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase">
                                                    {trend}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Topic Breakdown */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-900 p-6 border-b border-slate-800 flex items-center gap-4">
                                <div className="p-2 bg-slate-800 rounded-xl">
                                    <ListChecks className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-black text-white uppercase italic">Step 2: Interview Topic Breakdown</h2>
                            </div>
                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {result.topicBreakdown.map((topic, i) => (
                                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight">{topic.title}</h4>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-slate-600 font-medium"><span className="text-slate-900 font-bold uppercase">Why:</span> {topic.importance}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Target className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-slate-600 font-medium"><span className="text-slate-900 font-bold uppercase">Depth:</span> {topic.depthExpected}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Real Interview Questions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-4">
                                <HelpCircle className="w-6 h-6 text-red-600" />
                                <h2 className="text-xl font-black text-slate-900 uppercase italic">Step 3: Real Interview Questions</h2>
                            </div>
                            <div className="space-y-4">
                                {result.interviewQuestions.map((q, i) => (
                                    <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-8 space-y-6">
                                            <div className="space-y-2">
                                                <span className="text-xs font-black text-red-500 uppercase tracking-widest">Question {i + 1}</span>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{q.question}</h3>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Target className="w-3.5 h-3.5 text-blue-500" /> <span className="text-slate-700">What's being tested?</span>
                                                        </h4>
                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{q.whatIsTested}</p>
                                                    </div>
                                                    <div className="p-5 bg-red-50 rounded-2xl border border-red-100 space-y-2">
                                                        <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                                            <AlertCircle className="w-3.5 h-3.5" /> Common Mistakes
                                                        </h4>
                                                        <ul className="space-y-1">
                                                            {q.commonMistakes.map((m, j) => (
                                                                <li key={j} className="text-xs text-red-700 font-bold flex items-center gap-2">
                                                                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                                                                    {m}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-slate-300">Senior Consultant Response</span>
                                                    </h4>
                                                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">{q.sampleAnswer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Prep Guidance */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-emerald-50 p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                        <BookOpen className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 uppercase italic">Step 4: Prep Guidance</h2>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full">
                                    <Clock className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-black text-white">{result.preparationGuidance.estimatedTime}</span>
                                </div>
                            </div>
                            <div className="p-8 grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> Deal Breakers (Must Know)
                                        </h3>
                                        <div className="space-y-2">
                                            {result.preparationGuidance.studyPriority.dealBreakers.map((item, i) => (
                                                <div key={i} className="px-4 py-3 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-bold text-red-700">
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest">High Priority Study</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.preparationGuidance.studyPriority.high.map((item, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Preparation Checklist</h3>
                                    <div className="space-y-3">
                                        {result.preparationGuidance.checklist.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded border-2 border-slate-200 flex-shrink-0" />
                                                <span className="text-sm text-slate-700 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Self Practice */}
                        <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-20 group-hover:opacity-40 transition-opacity">
                                <TrendingUp className="w-32 h-32" />
                            </div>
                            <div className="relative space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800 rounded-xl">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-black text-white uppercase italic">Step 5: Self-Practice & Improvement</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Mock Interview Tips</h3>
                                        <div className="grid gap-3">
                                            {result.selfPractice.tips.map((tip, i) => (
                                                <div key={i} className="p-4 bg-slate-800 rounded-2xl flex items-center gap-4 group">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-sm text-slate-300 font-medium">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-red-600 rounded-3xl space-y-3 shadow-2xl shadow-red-500/20">
                                            <h3 className="text-xs font-black text-white/80 uppercase tracking-widest">Confidence vs Knowledge</h3>
                                            <p className="text-sm text-white font-bold leading-relaxed">{result.selfPractice.confidenceVsKnowledge}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. Reality Check */}
                        <div className="bg-white rounded-3xl border-2 border-red-500 shadow-xl overflow-hidden relative">
                            <div className="bg-red-500 p-6 flex items-center gap-4">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-black text-white uppercase italic">Step 6: Reality Check (Honest Feedback)</h2>
                            </div>
                            <div className="p-8 grid md:grid-cols-12 gap-8">
                                <div className="md:col-span-4 space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Competition Level</h3>
                                        <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{result.realityCheck.competitionLevel}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">What Most Candidates Lack</h3>
                                        <ul className="space-y-2">
                                            {result.realityCheck.whatCandidatesLack.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                                                    <AlertCircle className="w-4 h-4 text-red-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="md:col-span-8 space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">2026 Market Expectations</h3>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{result.realityCheck.marketExpectations2026}</p>
                                    </div>
                                    <div className="p-8 bg-slate-900 rounded-3xl space-y-4">
                                        <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">How to Stand Out</h3>
                                        <p className="text-xl font-black text-white leading-tight uppercase italic tracking-tight">{result.realityCheck.howToStandOut}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    )
}
