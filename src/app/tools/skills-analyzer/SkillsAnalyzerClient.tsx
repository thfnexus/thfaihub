'use client'

import { useState, useEffect } from 'react'
import {
    Brain,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Target,
    TrendingUp,
    BookOpen,
    Award,
    Star
} from 'lucide-react'
import { generateSkillAnalysis, type SkillAnalysisResponse, type SkillAnalyzerInput } from './actions'

export default function SkillsAnalyzerClient({ userCredits }: { userCredits: number }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [analysis, setAnalysis] = useState<SkillAnalysisResponse | null>(null)

    const [formData, setFormData] = useState<SkillAnalyzerInput>({
        fullName: '',
        age: '',
        country: '',
        education: '',
        currentField: '',
        currentSkills: '',
        experience: '',
        futureGoal: '',
        financialUrgency: '',
        learningPreference: '',
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
                    education: profile.education || prev.education,
                    currentSkills: profile.skills || prev.currentSkills,
                }))
            } catch (e) {
                console.error('Error parsing profile', e)
            }
        }
    }, [])

    const handleChange = (field: keyof SkillAnalyzerInput, value: string) => {
        setFormData({ ...formData, [field]: value })
        if (error) setError('')
    }

    const nextStep = () => {
        if (currentStep === 1 && (!formData.age || !formData.country || !formData.education || !formData.currentField)) {
            setError('Please fill required fields')
            return
        }
        if (currentStep === 2 && (!formData.currentSkills || !formData.experience)) {
            setError('Please fill required fields')
            return
        }
        if (currentStep === 3 && (!formData.futureGoal || !formData.financialUrgency)) {
            setError('Please fill required fields')
            return
        }
        setError('')
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        const result = await generateSkillAnalysis(formData)

        if (result.success && result.data) {
            setAnalysis(result.data)
            // Save to localStorage
            localStorage.setItem('thf_user_profile', JSON.stringify({
                age: formData.age,
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
                    <Brain className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-950">Credits Exhausted</h2>
                    <p className="text-gray-800 mb-6">You need at least 1 credit to perform a deep skills analysis.</p>
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
                        <h2 className="text-3xl font-bold text-gray-950">Skill Analysis Results</h2>
                        <p className="text-gray-700 font-medium">Personalized for {formData.fullName || 'you'}</p>
                    </div>
                    <button
                        onClick={() => { setAnalysis(null); setCurrentStep(1); }}
                        className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all"
                    >
                        New Analysis
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mastery Level */}
                    <div className="bg-white p-8 rounded-2xl border shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Overall Mastery</h3>
                                <p className="text-sm text-gray-700">Current status in your field</p>
                            </div>
                        </div>
                        <div className="text-center py-8">
                            <div className="inline-block relative">
                                <div className="text-5xl font-black text-blue-600 mb-2">{analysis.masteryLevel}%</div>
                                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">Level Scored</div>
                            </div>
                        </div>
                    </div>

                    {/* Skill Gaps */}
                    <div className="bg-white p-8 rounded-2xl border shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" />
                            Top Skill Gaps
                        </h3>
                        <div className="space-y-3">
                            {analysis.topSkillGaps.map((gap, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <span className="text-sm font-bold text-red-700">{gap}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 12 Month Roadmap */}
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        12-Month Learning Roadmap
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="text-xs font-black text-blue-600 uppercase mb-2">Months 1-3</div>
                            <p className="text-sm leading-relaxed text-gray-900 font-medium">{analysis.roadmap12Months.m1_3}</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="text-xs font-black text-purple-600 uppercase mb-2">Months 4-6</div>
                            <p className="text-sm leading-relaxed text-gray-900 font-medium">{analysis.roadmap12Months.m4_6}</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="text-xs font-black text-green-600 uppercase mb-2">Months 7-12</div>
                            <p className="text-sm leading-relaxed text-gray-900 font-medium">{analysis.roadmap12Months.m7_12}</p>
                        </div>
                    </div>
                </div>

                {/* Courses & Certification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl border shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Recommended Courses
                        </h3>
                        <div className="space-y-4">
                            {analysis.recommendedCourses.map((course, i) => (
                                <div key={i} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <div className="font-bold text-blue-900 border-b border-blue-100 pb-1 mb-2">{course.name}</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-blue-600 uppercase">{course.platform}</span>
                                        <span className="text-xs font-black bg-white px-2 py-1 rounded shadow-sm text-gray-700">{course.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-3xl text-white">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            High-Value Certification
                        </h3>
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                            <div className="text-2xl font-black mb-2 italic">"{analysis.worthCertifications}"</div>
                            <p className="text-sm text-white italic leading-relaxed">Highly recommended for your 2026 growth trajectory.</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/10 text-center opacity-70">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">This AI Trained and published by THF NEXUS</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <div className="text-center mb-8">
                    <Brain className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter uppercase italic">AI Skills Analyzer</h2>
                    <p className="text-[10px] font-black text-gray-500 mt-2 uppercase tracking-[0.2em]">This AI Trained and published by THF NEXUS</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10 px-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase letter tracking-widest">Step {currentStep} of 4</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Logic Scan {Math.round((currentStep / 4) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-700 rounded-full"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
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
                        <h3 className="font-bold text-gray-950 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                            Profile Basics
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Full Name (Optional)</label>
                            <input
                                type="text" value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                placeholder="Your Name" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Age *</label>
                                <input
                                    type="text" value={formData.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    placeholder="e.g. 21" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Country *</label>
                                <input
                                    type="text" value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    placeholder="e.g. Pakistan" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Education *</label>
                            <input
                                type="text" value={formData.education}
                                onChange={(e) => handleChange('education', e.target.value)}
                                placeholder="e.g. Undergraduate" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Current Field / Job *</label>
                            <input
                                type="text" value={formData.currentField}
                                onChange={(e) => handleChange('currentField', e.target.value)}
                                placeholder="e.g. Web Development or Student" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Skills */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-950 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                            Current Skills & XP
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Your Current Skills *</label>
                            <textarea
                                value={formData.currentSkills}
                                onChange={(e) => handleChange('currentSkills', e.target.value)}
                                placeholder="e.g. HTML, CSS, Basic JS, Excel"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium min-h-[120px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Experience Range *</label>
                            <select
                                value={formData.experience} onChange={(e) => handleChange('experience', e.target.value)}
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            >
                                <option value="">Select XP...</option>
                                <option value="Fresher / Student">Fresher / Student</option>
                                <option value="1-2 Years">1-2 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 3: Ambition */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-950 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                            Future Ambition
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Future Career Goal *</label>
                            <input
                                type="text" value={formData.futureGoal}
                                onChange={(e) => handleChange('futureGoal', e.target.value)}
                                placeholder="e.g. Senior Software Engineer" className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Financial Situation / Urgency *</label>
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

                {/* Step 4: Method */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-950 border-b pb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">4</span>
                            Learning Method
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Learning Preference *</label>
                            <select
                                value={formData.learningPreference} onChange={(e) => handleChange('learningPreference', e.target.value)}
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                            >
                                <option value="">Select style...</option>
                                <option value="Video Courses">Video Courses</option>
                                <option value="Reading / Documentation">Reading / Documentation</option>
                                <option value="Project Based / Building">Project Based / Building</option>
                                <option value="Mentorship">Mentorship</option>
                                <option value="Mixed Style">Mixed Style</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 tracking-widest">Constraints / Notes (Optional)</label>
                            <textarea
                                value={formData.additionalNotes}
                                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                placeholder="e.g. No high-end PC, only mobile, no paid courses"
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
                        className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-gray-900 disabled:opacity-20 transition-all font-bold"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>

                    {currentStep < 4 ? (
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
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-4 h-4" />
                                    Launch Analysis
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
