'use client'

import React, { useState } from 'react'
import {
    Layout,
    Zap,
    Target,
    Building2,
    Github,
    BarChart3,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Trophy,
    FileText,
    Copy,
    ChevronDown,
    ChevronUp,
    Terminal,
    Info,
    Rocket,
    Plus,
    Trash2,
    User,
    Briefcase,
    GraduationCap,
    Code2,
    Sparkles,
    Eye,
    Download
} from 'lucide-react'
import {
    generatePortfolioBlueprint,
    type PortfolioBuilderInput,
    type PortfolioBlueprint,
    type PortfolioExperience,
    type PortfolioEducation,
    type PortfolioProjectInfo
} from './actions'
import { cn } from '@/lib/utils'

interface PortfolioBuilderClientProps {
    userCredits: number
}

export default function PortfolioBuilderClient({ userCredits }: PortfolioBuilderClientProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<PortfolioBlueprint | null>(null)
    const [expandedProject, setExpandedProject] = useState<number | null>(null)
    const [copied, setCopied] = useState<string | null>(null)
    const [skillsInput, setSkillsInput] = useState('')

    const [formData, setFormData] = useState<PortfolioBuilderInput>({
        fullName: '',
        targetRole: '',
        bio: '',
        experience: [{ role: '', company: '', duration: '', description: '' }],
        education: [{ degree: '', institution: '', year: '' }],
        projects: [{ name: '', techStack: '', description: '', link: '' }],
        skills: []
    })

    const handleExperienceChange = (index: number, field: keyof PortfolioExperience, value: string) => {
        const newExperience = [...formData.experience]
        newExperience[index][field] = value
        setFormData({ ...formData, experience: newExperience })
    }

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, { role: '', company: '', duration: '', description: '' }]
        })
    }

    const removeExperience = (index: number) => {
        const newExperience = formData.experience.filter((_, i) => i !== index)
        setFormData({ ...formData, experience: newExperience })
    }

    const handleEducationChange = (index: number, field: keyof PortfolioEducation, value: string) => {
        const newEducation = [...formData.education]
        newEducation[index][field] = value
        setFormData({ ...formData, education: newEducation })
    }

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { degree: '', institution: '', year: '' }]
        })
    }

    const removeEducation = (index: number) => {
        const newEducation = formData.education.filter((_, i) => i !== index)
        setFormData({ ...formData, education: newEducation })
    }

    const handleProjectChange = (index: number, field: keyof PortfolioProjectInfo, value: string) => {
        const newProjects = [...formData.projects]
        newProjects[index][field] = value
        setFormData({ ...formData, projects: newProjects })
    }

    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, { name: '', techStack: '', description: '', link: '' }]
        })
    }

    const removeProject = (index: number) => {
        const newProjects = formData.projects.filter((_, i) => i !== index)
        setFormData({ ...formData, projects: newProjects })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (userCredits < 1) {
            setError("Insufficient credits. Please upgrade your plan.")
            return
        }
        setLoading(true)
        setError(null)
        try {
            const res = await generatePortfolioBlueprint(formData)
            if (res.success && res.data) {
                setResults(res.data)
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            } else {
                setError(res.error || "Failed to generate portfolio blueprint.")
            }
        } catch (err) {
            setError("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 5))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Header section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto print:hidden">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <Rocket className="w-3 h-3" /> Professional Architect
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                    AI Portfolio <span className="text-cyan-600">Architect</span>
                </h1>
                <p className="text-slate-700 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-tight">
                    Convert your raw experience into a high-impact professional portfolio blueprint designed for 2026.
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    This AI Trained and published by THF NEXUS
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-700 border border-slate-200">
                        Available Credits: <span className="text-cyan-600">{userCredits}</span>
                    </div>
                </div>
            </div>

            <div className={cn(
                "grid lg:grid-cols-2 gap-8 md:gap-12 items-start transition-all duration-700",
                results ? "lg:grid-cols-1 max-w-5xl mx-auto" : "lg:grid-cols-1 max-w-3xl mx-auto w-full px-2 md:px-0"
            )}>
                {!results && (
                    <div className="bg-white p-6 md:p-12 rounded-[40px] border border-slate-200 shadow-2xl space-y-8">
                        {/* Step Indicator */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} className="flex flex-col items-center gap-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all",
                                        step >= s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                                    )}>
                                        {s}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] uppercase font-black tracking-widest hidden md:block",
                                        step === s ? "text-cyan-600" : "text-slate-600"
                                    )}>
                                        {s === 1 ? 'Profile' : s === 2 ? 'Experience' : s === 3 ? 'Education' : s === 4 ? 'Projects' : 'Skills'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Step 1: Profile */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <User className="w-5 h-5 text-cyan-500" /> Basic Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Target Role</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g. Senior Backend Engineer"
                                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                    value={formData.targetRole}
                                                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Brief Bio</label>
                                            <textarea
                                                required
                                                rows={4}
                                                placeholder="Write a few lines about your professional background and goals."
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-cyan-500 outline-none transition-all font-bold text-sm resize-none"
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Experience */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-cyan-500" /> Work Experience
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addExperience}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" /> Add Experience
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {formData.experience.map((exp, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 relative group">
                                                {formData.experience.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExperience(idx)}
                                                        className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-md border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Role</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Software Engineer"
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                            value={exp.role}
                                                            onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Company</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Tech Corp"
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                            value={exp.company}
                                                            onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Duration</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="2022 - Present"
                                                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                        value={exp.duration}
                                                        onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Main Achievements/Tasks</label>
                                                    <textarea
                                                        required
                                                        rows={3}
                                                        placeholder="What were your key contributions?"
                                                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm resize-none"
                                                        value={exp.description}
                                                        onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Education */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-cyan-500" /> Education
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addEducation}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" /> Add Education
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {formData.education.map((edu, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 relative group">
                                                {formData.education.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(idx)}
                                                        className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-md border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Degree</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="BSc Computer Science"
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                            value={edu.degree}
                                                            onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Institution</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="University of Excellence"
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                            value={edu.institution}
                                                            onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Year</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="2018 - 2022"
                                                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                        value={edu.year}
                                                        onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Projects */}
                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <Code2 className="w-5 h-5 text-cyan-500" /> Projects
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addProject}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" /> Add Project
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {formData.projects.map((proj, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 relative group">
                                                {formData.projects.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProject(idx)}
                                                        className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-md border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Project Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="AI SaaS Dashboard"
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                            value={proj.name}
                                                            onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Tech Stack</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Next.js, Tailwind, OpenAI"
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm"
                                                            value={proj.techStack}
                                                            onChange={(e) => handleProjectChange(idx, 'techStack', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Short Description</label>
                                                    <textarea
                                                        required
                                                        rows={3}
                                                        placeholder="What problems does this project solve?"
                                                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-cyan-500 outline-none transition-all font-bold text-sm resize-none"
                                                        value={proj.description}
                                                        onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Skills */}
                            {step === 5 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-cyan-500" /> Technical Skills
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Main Skills (Comma separated)</label>
                                            <textarea
                                                required
                                                rows={4}
                                                placeholder="React, TypeScript, Node.js, Python, AWS, Docker..."
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-[32px] focus:border-cyan-500 outline-none transition-all font-bold text-sm resize-none p-8"
                                                value={skillsInput}
                                                onChange={(e) => setSkillsInput(e.target.value)}
                                                onBlur={() => setFormData({
                                                    ...formData,
                                                    skills: skillsInput.split(',').map(s => s.trim()).filter(s => s !== '')
                                                })}
                                            />
                                        </div>
                                        <div className="bg-cyan-50 p-6 rounded-[32px] border border-cyan-100">
                                            <p className="text-xs text-cyan-700 font-bold leading-relaxed flex items-start gap-3">
                                                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                Finalizing your data collection. Our AI will now architect your portfolio based on these details, optimizing for 2026 hiring trends.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-xs"
                                    >
                                        Back
                                    </button>
                                ) : <div />}

                                {step < 5 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-lg"
                                    >
                                        Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-700 disabled:bg-slate-400 transition-all flex items-center gap-2 group shadow-lg shadow-cyan-200"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Architecting...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4" /> Generate Blueprint
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Results Section */}
                {results && (
                    <div id="results-section" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Summary Header */}
                        <div className="bg-slate-900 text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden space-y-8 border border-slate-800 shadow-2xl">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <ShieldCheck className="w-64 h-64 text-cyan-400" />
                            </div>

                            <div className="space-y-4 relative">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                                            {formData.fullName}
                                        </h2>
                                        <p className="text-cyan-400 font-bold text-lg uppercase tracking-widest italic flex items-center gap-2">
                                            <Target className="w-5 h-5" /> {formData.targetRole}
                                        </p>
                                    </div>
                                    <div className="flex gap-4 print:hidden">
                                        <button
                                            onClick={() => window.print()}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-colors flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" /> Save PDF
                                        </button>
                                        <button
                                            onClick={() => setResults(null)}
                                            className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            New Draft
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-[32px] border border-white/10 italic font-bold text-slate-100 leading-relaxed text-lg">
                                    "{results.optimizedBio}"
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                            <div className="space-y-8">
                                {/* Experience Refined */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                        <Briefcase className="w-4 h-4 text-cyan-500" /> Strategic Work Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {results.refinedExperience.map((exp, i) => (
                                            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4 border-l-8 border-l-slate-900">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{exp.role}</h4>
                                                        <p className="text-cyan-600 font-black text-xs uppercase tracking-widest">{exp.company} • {exp.duration}</p>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-700 font-bold leading-relaxed">
                                                    {exp.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects Section */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                        <Target className="w-4 h-4 text-amber-500" /> High-Signal Project Architectures
                                    </h3>
                                    <div className="space-y-6">
                                        {results.structuredProjects.map((proj, i) => (
                                            <div key={i} className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                                                <div className="p-8 space-y-6">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{proj.name}</h4>
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {proj.techStack.split(',').map((tech, idx) => (
                                                                    <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                                                                        {tech.trim()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                                            <Trophy className="w-3 h-3" /> Impact Optimized
                                                        </div>
                                                    </div>

                                                    <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">STAR Method Description</p>
                                                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{proj.impactDescription}</p>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="p-5 bg-cyan-50 rounded-3xl border border-cyan-100 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest flex items-center gap-2">
                                                                    <FileText className="w-3 h-3" /> Resume Point
                                                                </p>
                                                                <button
                                                                    onClick={() => copyToClipboard(proj.resumeSummary, `resume-${i}`)}
                                                                    className="text-cyan-400 hover:text-cyan-600 transition-colors"
                                                                >
                                                                    {copied === `resume-${i}` ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-slate-700 font-bold leading-relaxed italic">{proj.resumeSummary}</p>
                                                        </div>

                                                        <div className="border border-slate-100 rounded-3xl p-5 flex flex-col justify-center gap-4">
                                                            <button
                                                                onClick={() => setExpandedProject(expandedProject === i ? null : i)}
                                                                className="w-full flex items-center justify-between text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 transition-all tracking-widest"
                                                            >
                                                                <span className="flex items-center gap-2 italic underline underline-offset-4 decoration-cyan-500 decoration-2">
                                                                    Technical README Skeleton
                                                                </span>
                                                                {expandedProject === i ? <ChevronUp className="w-4 h-4 text-cyan-500" /> : <ChevronDown className="w-4 h-4" />}
                                                            </button>
                                                            {expandedProject === i && (
                                                                <div className="animate-in slide-in-from-top-2 duration-300">
                                                                    <div className="relative group">
                                                                        <div className="absolute top-2 right-2 flex gap-2">
                                                                            <button
                                                                                onClick={() => copyToClipboard(proj.readmeSkeleton, `readme-${i}`)}
                                                                                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700"
                                                                            >
                                                                                {copied === `readme-${i}` ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                                            </button>
                                                                        </div>
                                                                        <pre className="p-4 bg-slate-900 rounded-2xl text-[10px] text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800">
                                                                            {proj.readmeSkeleton}
                                                                        </pre>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Skills Matrix */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                        <Code2 className="w-4 h-4 text-cyan-500" /> Skills Matrix
                                    </h3>
                                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                        {results.skillsMatrix.map((matrix, i) => (
                                            <div key={i} className="space-y-3 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{matrix.category}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {matrix.skills.map((skill, idx) => (
                                                        <span key={idx} className="bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-100">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Design Advice */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                        <Layout className="w-4 h-4 text-purple-500" /> Visual Direction
                                    </h3>
                                    <div className="bg-slate-900 text-white p-8 rounded-[40px] border border-slate-800 shadow-2xl space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full border-4 border border-white/20 shadow-xl"
                                                style={{ backgroundColor: results.designAdvice.themeColor }}
                                            />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Core Theme Color</p>
                                                <p className="text-xl font-black italic uppercase italic text-cyan-400">{results.designAdvice.themeColor}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Typography</p>
                                                <p className="text-sm font-bold text-slate-200">{results.designAdvice.typography}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Layout Strategy</p>
                                                <p className="text-sm font-bold text-slate-200">{results.designAdvice.layoutSuggestion}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Market Analysis */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                        <BarChart3 className="w-4 h-4 text-emerald-500" /> 2026 Market Analysis
                                    </h3>
                                    <div className="bg-white p-8 rounded-[40px] border-4 border-slate-900 space-y-4 border-b-8 border-r-8">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <ShieldCheck className="w-5 h-5" />
                                            <p className="text-xs font-black uppercase tracking-widest">Architect's Forecast</p>
                                        </div>
                                        <p className="text-sm text-slate-800 font-bold leading-relaxed italic">
                                            {results.marketAnalysis}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Advice */}
                        <div className="text-center pb-12 print:hidden">
                            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Ready to build? Copy the blueprint and start your development phase.</p>
                        </div>

                        {/* Print Only Branding Page */}
                        <div className="hidden print:block print:break-before-page pt-20 text-center space-y-8 h-screen border-t-8 border-slate-900">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                                    THF AI <span className="text-cyan-600">HUB</span>
                                </h1>
                                <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">Empowering Your Technical Career</p>
                            </div>

                            <div className="max-w-2xl mx-auto p-12 bg-slate-50 rounded-[40px] border-2 border-slate-100 text-left space-y-6">
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase">Why use THF AI HUB?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center text-xs font-black">1</div>
                                        <p className="text-slate-600 font-bold">Real-world AI tools designed for 2026 hiring standards.</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center text-xs font-black">2</div>
                                        <p className="text-slate-600 font-bold">Personalized career roadmaps and technical portfolio architectures.</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center text-xs font-black">3</div>
                                        <p className="text-slate-600 font-bold">Expert-level advice on scholarships, courses, and interviews.</p>
                                    </li>
                                </ul>
                                <div className="pt-8 text-center border-t border-slate-200">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Visit us at</p>
                                    <p className="text-xl font-black text-cyan-600">thfnexus.com</p>
                                </div>
                            </div>

                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest absolute bottom-20 left-0 right-0">
                                Generated by THF AI Portfolio Architect • © 2025 THF Nexus
                            </p>
                        </div>

                        {/* Print Styles */}
                        <style jsx global>{`
                            @page {
                                margin: 20mm;
                            }
                            @media print {
                                html, body { 
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    background: white !important;
                                }
                                #results-section {
                                    padding: 0 !important;
                                    margin: 0 !important;
                                }
                                .max-w-7xl { 
                                    max-width: 100% !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                }
                                header, footer, nav, .print\\:hidden {
                                    display: none !important;
                                }
                                .print\\:break-before-page {
                                    break-before: page !important;
                                    padding-top: 20mm !important;
                                }
                                /* Fix for elements splitting across pages */
                                .bg-white, 
                                .bg-slate-900,
                                .rounded-\\[40px\\],
                                section,
                                [class*="rounded-"],
                                .space-y-4 > div,
                                .space-y-6 > div {
                                    break-inside: avoid-page !important;
                                    page-break-inside: avoid !important;
                                    display: block !important; /* Flex/Grid can break break-inside */
                                    position: relative !important;
                                }
                                h3, h4, h2 {
                                    break-after: avoid-page !important;
                                    page-break-after: avoid !important;
                                }
                                .rounded-\\[40px\\], .rounded-3xl, .rounded-2xl {
                                    border-radius: 12px !important;
                                }
                                .shadow-2xl, .shadow-xl, .shadow-md, .shadow-sm {
                                    box-shadow: none !important;
                                    border: 1px solid #e2e8f0 !important;
                                }
                                .bg-slate-900 {
                                    background-color: #0f172a !important;
                                    -webkit-print-color-adjust: exact;
                                }
                                .text-cyan-400 {
                                    color: #22d3ee !important;
                                    -webkit-print-color-adjust: exact;
                                }
                                .print\\:break-before-page {
                                    break-before: page !important;
                                }
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    )
}
