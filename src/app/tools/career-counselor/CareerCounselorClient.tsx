'use client'

import { useState, useEffect } from 'react'
import { Loader2, Sparkles, ChevronRight, ChevronLeft, AlertTriangle, TrendingUp, Calendar, Lightbulb } from 'lucide-react'
import { generateCareerGuidance } from './actions'

interface CareerMatchScore {
    career: string
    score: number
}

interface Roadmap {
    months1to3: string
    months4to6: string
    months7to12: string
}

interface FinalAdvice {
    startThisWeek: string
    avoid: string
    reconsiderWhen: string
}

interface CareerGuidanceData {
    careerMatchScores: CareerMatchScore[]
    bestPath: string
    roadmap: Roadmap
    riskWarnings: string[]
    finalAdvice: FinalAdvice
}

export default function CareerCounselorClient({ userCredits }: { userCredits: number }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [guidance, setGuidance] = useState<CareerGuidanceData | null>(null)
    const [customInterest, setCustomInterest] = useState('') // For "Other" option in interest
    const [customEducation, setCustomEducation] = useState('') // For "Other" option in education
    const [customGoal, setCustomGoal] = useState('') // For "Other" option in goal
    const [formData, setFormData] = useState({
        age: '',
        country: '',
        education: '',
        primaryInterest: '',
        workStyle: '',
        workType: '',
        mathLevel: '',
        englishLevel: '',
        financialUrgency: '',
        communicationLevel: '',
        additionalNotes: '',
        primaryGoal: ''
    })

    // Load from localStorage on mount
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
                }))
            } catch (e) {
                console.error('Error parsing profile', e)
            }
        }
    }, [])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    const nextStep = () => {
        // Validation for Step 1
        if (currentStep === 1) {
            if (!formData.age || !formData.country || !formData.education) {
                setError('Please fill all basic info')
                return
            }
            if (formData.education === 'Other' && !customEducation) {
                setError('Please specify your education')
                return
            }
        }

        // Validation for Step 2
        if (currentStep === 2) {
            if (!formData.primaryInterest || !formData.workStyle || !formData.workType) {
                setError('Please fill your preferences')
                return
            }
            if (formData.primaryInterest === 'Other' && !customInterest) {
                setError('Please specify your interest')
                return
            }
        }

        // Validation for Step 3
        if (currentStep === 3) {
            if (!formData.mathLevel || !formData.englishLevel || !formData.financialUrgency || !formData.communicationLevel) {
                setError('Please complete all skill levels')
                return
            }
        }

        setError('')
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        // Final validation
        if (!formData.primaryGoal) {
            setError('Please select your primary goal')
            return
        }
        if (formData.primaryGoal === 'Other' && !customGoal) {
            setError('Please specify your goal')
            return
        }

        setLoading(true)
        setError('')

        // Merge custom inputs if "Other" was selected
        const dataToSend = {
            ...formData,
            education: formData.education === 'Other' ? customEducation : formData.education,
            primaryInterest: formData.primaryInterest === 'Other' ? customInterest : formData.primaryInterest,
            primaryGoal: formData.primaryGoal === 'Other' ? customGoal : formData.primaryGoal
        }

        const result = await generateCareerGuidance(dataToSend)

        if (result.success && result.data) {
            setGuidance(result.data)
            // Save to localStorage
            localStorage.setItem('thf_user_profile', JSON.stringify({
                age: formData.age,
                country: formData.country,
                education: dataToSend.education,
                skills: dataToSend.primaryInterest
            }))
        } else {
            setError(result.error || 'Failed to generate guidance')
        }

        setLoading(false)
    }

    const handleNewGuidance = () => {
        setGuidance(null)
        setCurrentStep(1)
        setFormData({
            age: '',
            country: '',
            education: '',
            primaryInterest: '',
            workStyle: '',
            workType: '',
            mathLevel: '',
            englishLevel: '',
            financialUrgency: '',
            communicationLevel: '',
            additionalNotes: '',
            primaryGoal: ''
        })
    }

    if (userCredits === 0) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Insufficient Credits</h2>
                    <p className="text-gray-600 mb-6">
                        You need credits to use this tool. Upgrade your plan to get more credits!
                    </p>
                    <a href="/pricing" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
                        View Plans
                    </a>
                </div>
            </div>
        )
    }

    if (guidance) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Your Career Analysis</h2>
                    <button onClick={handleNewGuidance} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        New Analysis
                    </button>
                </div>

                {/* Career Match Scores */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Career Match Scores
                    </h3>
                    <div className="space-y-3">
                        {guidance.careerMatchScores.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{item.career}</span>
                                        <span className="font-bold text-blue-600">{item.score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm"><strong>Recommended Path:</strong> {guidance.bestPath}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Roadmap */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-600" />
                            12-Month Roadmap
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-sm text-gray-500 mb-1">Months 1-3</h4>
                                <p className="text-sm">{guidance.roadmap.months1to3}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-500 mb-1">Months 4-6</h4>
                                <p className="text-sm">{guidance.roadmap.months4to6}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-500 mb-1">Months 7-12</h4>
                                <p className="text-sm">{guidance.roadmap.months7to12}</p>
                            </div>
                        </div>
                    </div>

                    {/* Final Advice & Risks */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-600" />
                                Expert Advice
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <h4 className="font-bold text-xs text-green-700 uppercase mb-1">Start This Week</h4>
                                    <p className="text-sm">{guidance.finalAdvice.startThisWeek}</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                    <h4 className="font-bold text-xs text-red-700 uppercase mb-1">Avoid / Stop</h4>
                                    <p className="text-sm">{guidance.finalAdvice.avoid}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Risk Warnings
                            </h3>
                            <ul className="space-y-2">
                                {guidance.riskWarnings.map((warning, index) => (
                                    <li key={index} className="text-sm text-red-700 flex gap-2">
                                        <span className="shrink-0">•</span>
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-center py-8 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">This AI Trained and published by THF NEXUS</p>
                </div>
            </div>
        )
    }

    const totalSteps = 4

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl border shadow-sm">
                <div className="text-center mb-6">
                    <Sparkles className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tighter uppercase italic">AI Career Counselor</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">This AI Trained and published by THF NEXUS</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Step {currentStep} of {totalSteps}</span>
                        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Step 1: Basics */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">Age</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                className="w-full p-3 border rounded-lg"
                                placeholder="e.g., 18"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Country</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                className="w-full p-3 border rounded-lg"
                                placeholder="e.g., Pakistan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Current Education</label>
                            <select
                                value={formData.education}
                                onChange={(e) => {
                                    handleChange('education', e.target.value)
                                    if (e.target.value !== 'Other') setCustomEducation('')
                                }}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="School Student">School Student</option>
                                <option value="Matric / O-Levels">Matric / O-Levels</option>
                                <option value="Inter / A-Levels">Inter / A-Levels</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Other">Other</option>
                            </select>
                            {formData.education === 'Other' && (
                                <input
                                    type="text"
                                    value={customEducation}
                                    onChange={(e) => setCustomEducation(e.target.value)}
                                    placeholder="Please specify your education..."
                                    className="w-full p-3 border rounded-lg mt-2"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Interest & Mindset */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4">Interest & Mindset</h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">Primary Interest</label>
                            <select
                                value={formData.primaryInterest}
                                onChange={(e) => {
                                    handleChange('primaryInterest', e.target.value)
                                    if (e.target.value !== 'Other') {
                                        setCustomInterest('') // Clear custom input if not Other
                                    }
                                }}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="Technology">Technology</option>
                                <option value="Design">Design</option>
                                <option value="Business">Business</option>
                                <option value="Medical">Medical</option>
                                <option value="Government / Exams">Government / Exams</option>
                                <option value="Other">Other</option>
                            </select>
                            {formData.primaryInterest === 'Other' && (
                                <input
                                    type="text"
                                    value={customInterest}
                                    onChange={(e) => setCustomInterest(e.target.value)}
                                    placeholder="Please specify your interest..."
                                    className="w-full p-3 border rounded-lg mt-2"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Work Style Preference</label>
                            <select
                                value={formData.workStyle}
                                onChange={(e) => handleChange('workStyle', e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="Theory-based">Theory-based</option>
                                <option value="Practical work">Practical work</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Preferred Work Type</label>
                            <select
                                value={formData.workType}
                                onChange={(e) => handleChange('workType', e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="Office Job">Office Job</option>
                                <option value="Remote / Freelance">Remote / Freelance</option>
                                <option value="Entrepreneurship">Entrepreneurship</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 3: Hard Skills & Self Assessment */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4">Self Assessment (Be Honest)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Math Level</label>
                                <select
                                    value={formData.mathLevel}
                                    onChange={(e) => handleChange('mathLevel', e.target.value)}
                                    className="w-full p-3 border rounded-lg"
                                >
                                    <option value="">Select...</option>
                                    <option value="Poor">Poor</option>
                                    <option value="Average">Average</option>
                                    <option value="Strong">Strong</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">English Level</label>
                                <select
                                    value={formData.englishLevel}
                                    onChange={(e) => handleChange('englishLevel', e.target.value)}
                                    className="w-full p-3 border rounded-lg"
                                >
                                    <option value="">Select...</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Financial Situation / Urgency</label>
                            <select
                                value={formData.financialUrgency}
                                onChange={(e) => handleChange('financialUrgency', e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="Urgent (Need income ASAP)">Urgent (Need income ASAP)</option>
                                <option value="Moderate (Seeking growth)">Moderate (Seeking growth)</option>
                                <option value="Stable (Focus on learning)">Stable (Focus on learning)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Communication & Confidence</label>
                            <select
                                value={formData.communicationLevel}
                                onChange={(e) => handleChange('communicationLevel', e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="Shy / Improving">Shy / Improving</option>
                                <option value="Confident / Social">Confident / Social</option>
                                <option value="Leadership Quality">Leadership Quality</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 4: Final Goals & Notes */}
                {currentStep === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4">Final Objective</h3>
                        <div>
                            <label className="block text-sm font-medium mb-2">What is your primary goal?</label>
                            <select
                                value={formData.primaryGoal}
                                onChange={(e) => {
                                    handleChange('primaryGoal', e.target.value)
                                    if (e.target.value !== 'Other') setCustomGoal('')
                                }}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select...</option>
                                <option value="High Salary">High Salary</option>
                                <option value="Work-Life Balance">Work-Life Balance</option>
                                <option value="International Opportunity">International Opportunity</option>
                                <option value="Government Job Security">Government Job Security</option>
                                <option value="Scientific Research">Scientific Research</option>
                                <option value="Other">Other</option>
                            </select>
                            {formData.primaryGoal === 'Other' && (
                                <input
                                    type="text"
                                    value={customGoal}
                                    onChange={(e) => setCustomGoal(e.target.value)}
                                    placeholder="Please specify your career goal..."
                                    className="w-full p-3 border rounded-lg mt-2"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Additional Notes / Questions (Optional)</label>
                            <textarea
                                value={formData.additionalNotes}
                                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                className="w-full p-3 border rounded-lg min-h-[100px]"
                                placeholder="Any specific personal constraints or questions for the AI counselor?"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1 || loading}
                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-black disabled:opacity-30"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    {currentStep < totalSteps ? (
                        <button
                            onClick={nextStep}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                        >
                            Next Step
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing Profile...
                                </>
                            ) : (
                                <>
                                    Complete Analysis
                                    <Sparkles className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
