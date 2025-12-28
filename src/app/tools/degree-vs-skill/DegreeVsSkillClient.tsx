'use client'

import { useState, useEffect } from 'react'
import {
    GraduationCap,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Loader2,
    AlertCircle,
    BarChart3,
    Clock,
    Globe,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Lightbulb
} from 'lucide-react'
import { generateDegreeVsSkillAnalysis, type DegreeVsSkillResponse, type DegreeVsSkillInput } from './actions'

export default function DegreeVsSkillClient({ userCredits }: { userCredits: number }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [analysis, setAnalysis] = useState<DegreeVsSkillResponse | null>(null)

    const [formData, setFormData] = useState<DegreeVsSkillInput>({
        ageGrade: '',
        country: '',
        education: '',
        desiredCareer: '',
        currentSkills: '',
        financialUrgency: '',
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
                    ageGrade: profile.age || prev.ageGrade,
                    country: profile.country || prev.country,
                    education: profile.education || prev.education,
                    currentSkills: profile.skills || prev.currentSkills,
                }))
            } catch (e) {
                console.error('Error parsing profile', e)
            }
        }
    }, [])

    const handleChange = (field: keyof DegreeVsSkillInput, value: string) => {
        setFormData({ ...formData, [field]: value })
        if (error) setError('')
    }

    const nextStep = () => {
        if (currentStep === 1 && (!formData.ageGrade || !formData.country || !formData.education)) {
            setError('Please fill required fields')
            return
        }
        if (currentStep === 2 && (!formData.desiredCareer || !formData.financialUrgency)) {
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

        const result = await generateDegreeVsSkillAnalysis(formData)

        if (result.success && result.data) {
            setAnalysis(result.data)
            // Save to localStorage
            localStorage.setItem('thf_user_profile', JSON.stringify({
                age: formData.ageGrade,
                country: formData.country,
                education: formData.education,
                skills: formData.currentSkills
            }))
        } else {
            setError(result.error || 'Failed to generate analysis')
        }

        setLoading(false)
    }

    if (userCredits === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                    <GraduationCap className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Credits Exhausted</h2>
                    <p className="text-gray-600 mb-6">You need at least 1 credit to perform a Degree vs Skill analysis.</p>
                    <a href="/pricing" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all">
                        Upgrade Plan
                    </a>
                </div>
            </div>
        )
    }

    if (analysis) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
                    <div>
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-2">
                            {analysis.verdict === 'Skill-heavy' ? 'Prioritize Skills' : 'Degree Recommended'}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 italic uppercase">Degree vs Skill Analysis</h2>
                        <p className="text-gray-500 font-medium">Comparison for {formData.desiredCareer}</p>
                    </div>
                    <button
                        onClick={() => { setAnalysis(null); setCurrentStep(1); }}
                        className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all"
                    >
                        New Comparison
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Comparison Chart */}
                    <div className="bg-white p-8 rounded-2xl border shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            ROI & Earning Potential
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                                    <span>Degree Path</span>
                                    <span>{analysis.comparisonMetrics.timeToROI.degree}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full" style={{ width: '40%' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                                    <span>Skill Path</span>
                                    <span>{analysis.comparisonMetrics.timeToROI.skill}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <h4 className="font-bold text-purple-900 text-sm mb-1">Earning Gap</h4>
                            <p className="text-xs text-purple-700 font-medium leading-relaxed">{analysis.comparisonMetrics.potentialEarningsGap}</p>
                        </div>
                    </div>

                    {/* Suitability Verdict */}
                    <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                                <ShieldCheck className="w-6 h-6" />
                                The Verdict
                            </h3>
                            <div className="text-4xl font-black mb-4 italic uppercase tracking-tighter">
                                {analysis.verdict === 'Skill-heavy' ? 'Focus on Mastery' : 'Get the Degree'}
                            </div>
                            <p className="text-white/70 leading-relaxed font-medium">
                                Based on your location ({formData.country}) and goal ({formData.desiredCareer}),
                                a {analysis.verdict.toLowerCase()} approach is the most efficient path to success.
                            </p>
                        </div>
                        <div className="mt-8 bg-white/10 p-4 rounded-xl flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-300" />
                            <span className="text-xs font-bold">Estimated stabilization: {analysis.verdict === 'Skill-heavy' ? '1-2 Years' : '4-5 Years'}</span>
                        </div>
                    </div>
                </div>

                {/* Upsides & Downsides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-green-500">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            Skill Path Benefits
                        </h3>
                        <ul className="space-y-4">
                            {analysis.upsidesAndDownsides.skillPath.map((item, i) => (
                                <li key={i} className="text-sm font-medium text-gray-700 flex gap-3">
                                    <span className="text-green-500 font-bold shrink-0">+</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-blue-500">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-600">
                            <GraduationCap className="w-5 h-5" />
                            Degree Path Benefits
                        </h3>
                        <ul className="space-y-4">
                            {analysis.upsidesAndDownsides.degreePath.map((item, i) => (
                                <li key={i} className="text-sm font-medium text-gray-700 flex gap-3">
                                    <span className="text-blue-500 font-bold shrink-0">+</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Risk & Advice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-800">
                            <AlertTriangle className="w-5 h-5" />
                            AI & Industry Risk
                        </h3>
                        <p className="text-sm text-red-700 font-medium leading-relaxed">{analysis.riskFactor}</p>
                    </div>
                    <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                            <Lightbulb className="w-5 h-5" />
                            Strategic Advice
                        </h3>
                        <p className="text-sm text-green-700 font-medium font-bold leading-relaxed italic">"{analysis.finalRecommendation}"</p>
                    </div>
                </div>

                <div className="text-center py-8 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">This AI Trained and published by THF NEXUS</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <div className="text-center mb-8">
                    <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tighter uppercase italic">Degree vs Skill Simulator</h2>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em]">This AI Trained and published by THF NEXUS</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10 px-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-300 uppercase letter tracking-widest">Step {currentStep} of 3</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ROI Analysis {Math.round((currentStep / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-700 rounded-full"
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

                {/* Step 1: Profile */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                            Current Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Age / Current Grade *</label>
                                <input
                                    type="text" value={formData.ageGrade}
                                    onChange={(e) => handleChange('ageGrade', e.target.value)}
                                    placeholder="e.g. 18 or 12th Grade" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Country *</label>
                                <input
                                    type="text" value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    placeholder="e.g. Pakistan" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Current Education *</label>
                            <input
                                type="text" value={formData.education}
                                onChange={(e) => handleChange('education', e.target.value)}
                                placeholder="e.g. High School Completed" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Ambition */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                            Future Goal
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Desired Career *</label>
                            <input
                                type="text" value={formData.desiredCareer}
                                onChange={(e) => handleChange('desiredCareer', e.target.value)}
                                placeholder="e.g. Artificial Intelligence Engineer" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Financial Situation / Urgency *</label>
                            <select
                                value={formData.financialUrgency} onChange={(e) => handleChange('financialUrgency', e.target.value)}
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            >
                                <option value="">Select...</option>
                                <option value="Urgent (Need income ASAP)">Urgent (Need income ASAP)</option>
                                <option value="Moderate (Seeking growth)">Moderate (Seeking growth)</option>
                                <option value="Stable (Focus on learning)">Stable (Focus on learning)</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 3: Skills & Context */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                            Skills & Context
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Current Skills (Optional)</label>
                            <textarea
                                value={formData.currentSkills}
                                onChange={(e) => handleChange('currentSkills', e.target.value)}
                                placeholder="e.g. Basic Computer, Photoshop, English Communication"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.additionalNotes}
                                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                placeholder="Any specific constraints or questions?"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium min-h-[100px]"
                            />
                        </div>
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1 || loading}
                        className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 disabled:opacity-20 transition-all font-bold"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={nextStep}
                            className="px-8 py-3 bg-black text-white rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-gray-200"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:rotate-1 active:scale-[0.98] transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-100 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    Calculating...
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="w-4 h-4" />
                                    Get Comparison
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
