'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Loader2,
    AlertCircle,
    Calendar,
    Target,
    Zap,
    ShieldAlert,
    Trophy,
    BookOpen,
    Briefcase,
    Lightbulb,
    CheckCircle2,
    Flag,
    BarChart3
} from 'lucide-react'
import { generateStrategicRoadmap, type StrategicRoadmapResponse, type StrategicRoadmapInput } from './actions'

export default function CareerTimelineClient({ userCredits }: { userCredits: number }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [roadmap, setRoadmap] = useState<StrategicRoadmapResponse | null>(null)

    const [formData, setFormData] = useState<StrategicRoadmapInput>({
        age: '',
        country: '',
        currentEducationSkills: '',
        futureGoal: '',
        dailyTimeCommitment: '',
        learningStyle: '',
        additionalNotes: ''
    })

    // Auto-fill from previous tools
    useEffect(() => {
        const savedProfile = localStorage.getItem('thf_user_profile')
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile)
                setFormData(prev => ({
                    ...prev,
                    age: profile.age || prev.age,
                    country: profile.country || prev.country,
                    currentEducationSkills: profile.education || profile.skills || prev.currentEducationSkills,
                }))
            } catch (e) {
                console.error('Error parsing profile', e)
            }
        }
    }, [])

    const handleChange = (field: keyof StrategicRoadmapInput, value: string) => {
        setFormData({ ...formData, [field]: value })
        if (error) setError('')
    }

    const nextStep = () => {
        if (currentStep === 1 && (!formData.age || !formData.country || !formData.currentEducationSkills)) {
            setError('Please fill required fields')
            return
        }
        if (currentStep === 2 && (!formData.futureGoal || !formData.dailyTimeCommitment || !formData.learningStyle)) {
            setError('Please fill required fields')
            return
        }
        setError('')
        setCurrentStep(prev => Math.min(prev + 1, 3))
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        const result = await generateStrategicRoadmap(formData)

        if (result.success && result.data) {
            setRoadmap(result.data)
            // Persist for other tools
            localStorage.setItem('thf_user_profile', JSON.stringify({
                age: formData.age,
                country: formData.country,
                education: formData.currentEducationSkills,
                goal: formData.futureGoal
            }))
        } else {
            setError(result.error || 'Failed to generate roadmap')
        }

        setLoading(false)
    }

    if (userCredits === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                    <TrendingUp className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-950">Credits Exhausted</h2>
                    <p className="text-gray-800 mb-6">You need at least 1 credit to perform a strategic roadmap simulation.</p>
                    <a href="/pricing" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all">
                        Upgrade Plan
                    </a>
                </div>
            </div>
        )
    }

    if (roadmap) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
                    <div>
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-2">
                            {roadmap.careerArchetype}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-950 italic uppercase">Strategic Growth Roadmap</h2>
                        <p className="text-gray-700 font-medium">5-Year Action Plan (2026-2030)</p>
                    </div>
                    <button
                        onClick={() => { setRoadmap(null); setCurrentStep(1); }}
                        className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all"
                    >
                        New Roadmap
                    </button>
                </div>

                {/* Progress Visualization */}
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                        Analysis Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-600">
                                <span>Current Skills Gap</span>
                                <span>{roadmap.progressEstimates.skills}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${roadmap.progressEstimates.skills}%` }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-600">
                                <span>Education Alignment</span>
                                <span>{roadmap.progressEstimates.education}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${roadmap.progressEstimates.education}%` }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-600">
                                <span>Market Readiness</span>
                                <span>{roadmap.progressEstimates.readiness}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${roadmap.progressEstimates.readiness}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Personalized Roadmap (Timeline) */}
                <div className="bg-white p-8 rounded-2xl border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Calendar className="w-48 h-48" />
                    </div>
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <Flag className="w-5 h-5 text-orange-600" />
                        Step-by-Step Strategic Plan
                    </h3>
                    <div className="space-y-8 relative">
                        {/* Vertical line for the timeline */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 hidden md:block" />

                        {roadmap.roadmap.map((step, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-6 relative group">
                                <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-white border-4 border-orange-500 items-center justify-center z-10 font-black text-orange-600 text-xs transition-transform group-hover:scale-110">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{step.period}</span>
                                        <span className={`text-[10px] px-2 py-1 rounded bg-white border font-bold uppercase ${step.type === 'job' ? 'text-green-600' :
                                            step.type === 'skill' ? 'text-blue-600' :
                                                step.type === 'project' ? 'text-purple-600' : 'text-gray-700'
                                            }`}>
                                            {step.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 font-bold leading-relaxed">{step.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Milestones & Checkpoints */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-2 italic uppercase tracking-widest text-orange-400">
                        <CheckCircle2 className="w-6 h-6" />
                        Key Milestones & Checkpoints
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {roadmap.milestones.map((m, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                <div className={`text-[10px] font-black uppercase mb-1 ${m.type === 'short' ? 'text-blue-400' :
                                    m.type === 'medium' ? 'text-purple-400' : 'text-green-400'
                                    }`}>
                                    {m.type}-term ({m.period})
                                </div>
                                <p className="font-bold leading-snug">{m.goal}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Risks & Mastery */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-8 rounded-3xl border border-red-100 shadow-xl shadow-red-50">
                        <h3 className="font-black text-red-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                            <ShieldAlert className="w-6 h-6" />
                            Risk & Warning Indicators
                        </h3>
                        <div className="space-y-4">
                            {roadmap.risks.map((risk, i) => (
                                <div key={i} className="p-4 bg-white/60 rounded-xl border border-red-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-red-800 text-sm">{risk.factor}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${risk.level === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {risk.level} Risk
                                        </span>
                                    </div>
                                    <p className="text-xs text-red-700 leading-relaxed font-medium">{risk.warning}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-8 rounded-3xl text-white shadow-xl shadow-green-100 flex flex-col justify-between">
                        <div>
                            <div className="bg-white/10 w-fit px-3 py-1 rounded flex items-center gap-2 mb-4">
                                <Lightbulb className="w-3 h-3 text-yellow-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Mastery Tip</span>
                            </div>
                            <h3 className="text-4xl font-black mb-4 leading-none uppercase tracking-tighter italic">Winning the Roadmap</h3>
                            <p className="text-green-50 text-lg font-medium leading-relaxed opacity-95">"{roadmap.masteryTips}"</p>
                        </div>
                        <div className="mt-8 flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                            <Trophy className="w-8 h-8 text-yellow-300 shrink-0" />
                            <p className="text-[10px] font-bold text-green-100 uppercase leading-snug">This plan integrates data from Skills Analyzer, Degree vs Skill, and Market Trends.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-10 border-t opacity-70">
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-600">This AI Trained and published by THF NEXUS — Strategic Engine 2.0</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <div className="text-center mb-8">
                    <TrendingUp className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter uppercase italic">Strategic Roadmap Architecture</h2>
                    <p className="text-[10px] font-black text-gray-500 mt-2 uppercase tracking-[0.2em]">This AI Trained and published by THF NEXUS</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10 px-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase letter tracking-widest">Phase {currentStep} / 3</span>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Architecture Engine {Math.round((currentStep / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-orange-500 h-full transition-all duration-700 rounded-full"
                            style={{ width: `${(currentStep / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 font-bold">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Step 1: Profile Discovery */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div className="bg-orange-50/50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs">1</div>
                            <h3 className="font-bold text-orange-900 text-sm uppercase tracking-tight">Profile Discovery</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Age *</label>
                                <input
                                    type="text" value={formData.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    placeholder="e.g. 21" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 placeholder:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Country *</label>
                                <input
                                    type="text" value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    placeholder="e.g. Pakistan" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Current Education & Skills *</label>
                            <textarea
                                value={formData.currentEducationSkills}
                                onChange={(e) => handleChange('currentEducationSkills', e.target.value)}
                                placeholder="e.g. Inter Completed, Know Basic Python, Excel"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 placeholder:text-gray-600 min-h-[100px]"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Goal & Logistics */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="bg-orange-50/50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs">2</div>
                            <h3 className="font-bold text-orange-900 text-sm uppercase tracking-tight">Goal & Logistics</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Future Goal / Aspirations *</label>
                            <input
                                type="text" value={formData.futureGoal}
                                onChange={(e) => handleChange('futureGoal', e.target.value)}
                                placeholder="e.g. AI Engineer at Top Startup" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 placeholder:text-gray-600"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Daily Time Commitment *</label>
                                <select
                                    value={formData.dailyTimeCommitment} onChange={(e) => handleChange('dailyTimeCommitment', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 appearance-none"
                                >
                                    <option value="">Select Time...</option>
                                    <option value="1-2 hours">1-2 hours (Part-time)</option>
                                    <option value="3-5 hours">3-5 hours (Dedicated)</option>
                                    <option value="8+ hours">8+ hours (Full Intensity)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Preferred Learning Style *</label>
                                <select
                                    value={formData.learningStyle} onChange={(e) => handleChange('learningStyle', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 appearance-none"
                                >
                                    <option value="">Select Style...</option>
                                    <option value="Theory-based">Theory-based</option>
                                    <option value="Practical">Practical / Hands-on</option>
                                    <option value="Project-based">Project-based</option>
                                    <option value="Mixed">Mixed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Deployment Context */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="bg-orange-50/50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs">3</div>
                            <h3 className="font-bold text-orange-900 text-sm uppercase tracking-tight">Deployment Context</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Constraints & Preferences (Optional)</label>
                            <textarea
                                value={formData.additionalNotes}
                                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                placeholder="Financial constraints, parental concerns, interest in specific tools, etc."
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-950 placeholder:text-gray-600 min-h-[150px]"
                            />
                        </div>
                        <div className="bg-slate-900 p-5 rounded-2xl flex items-start gap-4">
                            <div className="bg-orange-500 p-2 rounded-lg">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Architecture Run</p>
                                <p className="text-[10px] text-white/70 leading-relaxed font-bold uppercase">
                                    This will simulate a 5-year journey based on your unique profile. Costs 1 Credit.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1 || loading}
                        className="flex items-center gap-2 px-6 py-3 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-900 disabled:opacity-20 transition-all font-bold"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={nextStep}
                            className="px-8 py-3 bg-black text-white rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-4 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 hover:rotate-1 active:scale-[0.98] transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-100 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    Architecting...
                                </>
                            ) : (
                                <>
                                    <Target className="w-4 h-4" />
                                    Generate Roadmap
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
