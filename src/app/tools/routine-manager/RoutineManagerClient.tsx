'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Clock,
    Zap,
    AlertCircle,
    ArrowRight,
    Loader2,
    Calendar,
    Target,
    Shield,
    Lightbulb,
    TrendingUp,
    Battery,
    Sun,
    Moon,
    Plus,
    Trash2,
    CheckCircle2,
    BarChart3,
    Award,
    Trophy,
    Flame,
    Coffee,
    Timer,
    PlusCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    generateRoutinePlan,
    type RoutineManagerInput,
    type RoutineTaskInput,
    createTask,
    getUserTasks,
    deleteTask,
    toggleTaskCompletion,
    getPerformanceHistory,
    getHabitStats,
    updateStreak
} from "./actions"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'
import { format } from "date-fns"

export default function RoutineManagerClient() {
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [performanceData, setPerformanceData] = useState<any[]>([])
    const [habitStats, setHabitStats] = useState<any[]>([])

    // New Task Form State
    const [newTask, setNewTask] = useState<RoutineTaskInput>({
        title: "",
        priority: "normal",
        focusType: "light_work",
        estimatedMins: 30
    })

    const [formData, setFormData] = useState<Omit<RoutineManagerInput, 'tasks'>>({
        wakeUpTime: "07:00",
        sleepTime: "23:00",
        studyJobHours: "8",
        energyPattern: "Morning active",
        distractions: [],
        stressLevel: "5",
        primaryFocus: "Study"
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const [userTasks, perf, habits] = await Promise.all([
            getUserTasks(),
            getPerformanceHistory(),
            getHabitStats()
        ])
        setTasks(userTasks || [])
        setPerformanceData(perf || [])
        setHabitStats(habits || [])
    }

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.title) return
        await createTask(newTask)
        setNewTask({ title: "", priority: "normal", focusType: "light_work", estimatedMins: 30 })
        loadData()
    }

    const handleDeleteTask = async (id: string) => {
        await deleteTask(id)
        loadData()
    }

    const handleToggleTask = async (id: string, completed: boolean) => {
        await toggleTaskCompletion(id, completed)
        loadData()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResults(null)

        const finalData: RoutineManagerInput = {
            ...formData,
            tasks: tasks.filter(t => !t.completed)
        }

        const response = await generateRoutinePlan(finalData)

        if (response.success) {
            setResults(response.data)
            await updateStreak("daily_routine")
            loadData()
            setTimeout(() => {
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } else {
            setError(response.error || "Something went wrong")
        }
        setLoading(false)
    }

    const distractionOptions = ["Social media", "Gaming", "Netflix", "YouTube", "Interruption"]
    const focusOptions = ["Study", "Skill learning", "Health", "Work"]

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-bold uppercase tracking-widest mb-6"
                >
                    <Flame className="w-4 h-4" /> AI Routine Master 2.0
                </motion.div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">
                    Intelligent <span className="text-pink-600">Daily Routine</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
                    Automated scheduling, task prioritization, and performance tracking — built to help you master your time.
                </p>
            </div>

            {/* Performance & Gamification Strip */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Streak</p>
                        <p className="text-2xl font-black text-slate-900">{habitStats[0]?.currentStreak || 0} Days</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mastery Level</p>
                        <p className="text-2xl font-black text-slate-900">Lvl {habitStats[0]?.level || 1}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Focus XP</p>
                        <p className="text-2xl font-black text-slate-900">{habitStats[0]?.xp || 0} pts</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 text-pink-600">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Focus Score</p>
                        <p className="text-2xl font-black text-slate-900">85%</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Left Column: Form & Tasks */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-12">
                    {/* Task Manager Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                        <h3 className="text-2xl font-black mb-8 uppercase italic flex items-center gap-3">
                            <Target className="w-6 h-6 text-pink-500" /> Pending Tasks
                        </h3>

                        <form onSubmit={handleAddTask} className="mb-8 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-400">
                                    <PlusCircle className="w-8 h-8" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pb-2">
                                <select
                                    className="bg-slate-800 text-xs font-bold border-none rounded-xl py-2 px-3 outline-none"
                                    value={newTask.priority}
                                    onChange={(e: any) => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="important">Important</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                                <select
                                    className="bg-slate-800 text-xs font-bold border-none rounded-xl py-2 px-3 outline-none"
                                    value={newTask.focusType}
                                    onChange={(e: any) => setNewTask({ ...newTask, focusType: e.target.value })}
                                >
                                    <option value="deep_work">Deep Work</option>
                                    <option value="light_work">Light Work</option>
                                    <option value="creative">Creative</option>
                                </select>
                            </div>
                        </form>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                            {tasks.filter(t => !t.completed).map((task) => (
                                <div key={task.id} className="group flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-pink-500/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleToggleTask(task.id, true)}
                                            className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center hover:border-pink-500"
                                        >
                                            <div className="w-3 h-3 bg-pink-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                                        </button>
                                        <div>
                                            <p className="font-bold text-sm leading-tight">{task.title}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                                                    task.priority === 'urgent' ? "bg-red-500/20 text-red-500" :
                                                        task.priority === 'important' ? "bg-orange-500/20 text-orange-500" :
                                                            "bg-blue-500/20 text-blue-500"
                                                )}>{task.priority}</span>
                                                <span className="text-[10px] font-bold text-slate-500">{task.estimatedMins} min</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {tasks.filter(t => !t.completed).length === 0 && (
                                <div className="text-center py-8">
                                    <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No pending tasks</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Main Settings Card */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Wake-up</label>
                                        <input
                                            required
                                            type="time"
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-medium"
                                            value={formData.wakeUpTime}
                                            onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Sleep</label>
                                        <input
                                            required
                                            type="time"
                                            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-medium"
                                            value={formData.sleepTime}
                                            onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Energy Pattern</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Morning active', 'Night active'].map((pattern) => (
                                            <button
                                                key={pattern}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, energyPattern: pattern })}
                                                className={cn(
                                                    "flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm uppercase",
                                                    formData.energyPattern === pattern
                                                        ? "border-pink-600 bg-pink-50 text-pink-600"
                                                        : "border-slate-100 bg-slate-50 text-slate-400"
                                                )}
                                            >
                                                {pattern === 'Morning active' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                                {pattern}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Main Distractions</label>
                                    <div className="flex flex-wrap gap-2">
                                        {distractionOptions.map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => {
                                                    const current = formData.distractions
                                                    setFormData({
                                                        ...formData,
                                                        distractions: current.includes(d) ? current.filter(x => x !== d) : [...current, d]
                                                    })
                                                }}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full border text-[10px] font-black uppercase transition-all",
                                                    formData.distractions.includes(d) ? "bg-pink-600 border-pink-600 text-white" : "bg-white border-slate-200 text-slate-500"
                                                )}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-pink-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-pink-700 transition-all shadow-xl hover:shadow-pink-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? (
                                    <>Optimizing... <Loader2 className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <>Generate Smart Routine <Zap className="w-5 h-5 fill-current" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Performance & Results */}
                <div id="results" className="lg:col-span-12 xl:col-span-8 space-y-12">
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center min-h-[600px] text-center"
                            >
                                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-8">
                                    <Zap className="w-12 h-12 text-pink-600 animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 italic uppercase">Analyzing Peak Performance...</h3>
                                <p className="text-slate-500 font-medium max-w-sm">We're mapping your tasks to your energy patterns for maximum productivity.</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-center gap-4 text-red-600 mb-8"
                            >
                                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                <p className="font-bold">{error}</p>
                            </motion.div>
                        )}

                        {/* Performance Dashboard - Always Visible if data exists */}
                        {performanceData.length > 0 && !loading && !results && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl mb-12"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 uppercase italic flex items-center gap-3">
                                            <BarChart3 className="w-8 h-8 text-pink-600" /> Performance <span className="text-pink-600">Analytics</span>
                                        </h3>
                                        <p className="text-slate-500 font-medium mt-1">Track your productivity trends over the last 7 days.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-black uppercase text-slate-600 tracking-tighter">Live Updates</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(str) => format(new Date(str), 'MMM d')}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                            />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="focusScore"
                                                stroke="#ec4899"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorFocus)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="stressLevel"
                                                stroke="#94a3b8"
                                                strokeWidth={2}
                                                fillOpacity={0}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Focus Score</p>
                                        <p className="text-xl font-black text-slate-900">88%</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Focus Hours</p>
                                        <p className="text-xl font-black text-slate-900">42.5h</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tasks Crushed</p>
                                        <p className="text-xl font-black text-slate-900">24/30</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consistency</p>
                                        <p className="text-xl font-black text-slate-900">92%</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {results && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                {/* Results Header Info */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-800">
                                        <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center">
                                            <Zap className="w-6 h-6 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-pink-500 tracking-tighter">AI Efficiency Score</p>
                                            <p className="text-xl font-black">94% Optimized</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-200">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                            <Coffee className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Break Frequency</p>
                                            <p className="text-xl font-black text-slate-900">{results.breakStrategy.type}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-200">
                                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                            <Timer className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Deep Work Ratio</p>
                                            <p className="text-xl font-black text-slate-900">4.5h / day</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Schedule + Task Priority */}
                                <div className="grid lg:grid-cols-5 gap-8">
                                    <div className="lg:col-span-3 bg-white rounded-[3rem] p-8 border border-slate-200 shadow-xl">
                                        <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase italic flex items-center gap-2">
                                            <Calendar className="w-6 h-6 text-pink-600" /> Optimized Schedule
                                        </h3>
                                        <div className="space-y-4">
                                            {results.dailySchedule.map((block: any, i: number) => (
                                                <div key={i} className="flex items-start gap-4 p-5 rounded-3xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all group relative">
                                                    <div className="flex-shrink-0 pt-1">
                                                        <div className="w-20 text-center">
                                                            <p className="text-sm font-black text-slate-900">{block.time}</p>
                                                            <p className="text-[10px] text-pink-600 font-bold uppercase">{block.duration}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-slate-900 mb-1 flex items-center gap-2">
                                                            {block.activity}
                                                            {block.pomodoro && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold italic"><Timer className="w-3 h-3" /> {block.pomodoro}</span>}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className={cn(
                                                                "text-[10px] px-3 py-0.5 rounded-full font-black uppercase",
                                                                block.type === "Deep Work" ? "bg-purple-100 text-purple-700" :
                                                                    block.type === "Recovery" ? "bg-green-100 text-green-700" :
                                                                        block.type === "Break" ? "bg-blue-100 text-blue-700" :
                                                                            "bg-slate-100 text-slate-700"
                                                            )}>{block.type}</span>
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                                                <Battery className="w-3 h-3" strokeWidth={3} /> {block.energyLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 flex flex-col gap-8">
                                        <div className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-2xl overflow-hidden relative border border-slate-800">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                                            <h3 className="text-xl font-black text-white mb-6 uppercase italic flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-pink-500" /> Goal Priority
                                            </h3>
                                            <div className="space-y-6 relative z-10">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-pink-500 tracking-widest mb-3">Critical (High Focus)</p>
                                                    <ul className="space-y-2">
                                                        {results.taskPrioritization.highPriority.map((t: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-3 text-sm font-bold bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                                                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                                                                {t}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3">Strategic (Mid Focus)</p>
                                                    <ul className="space-y-2">
                                                        {results.taskPrioritization.mediumPriority.map((t: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-3 text-sm font-bold bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                                {t}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-pink-50 rounded-[3rem] p-8 border border-pink-100 shadow-xl shadow-pink-500/5">
                                            <h3 className="text-xl font-black text-pink-900 mb-6 uppercase italic flex items-center gap-2">
                                                <Target className="w-5 h-5 text-pink-600" /> Focus Shield
                                            </h3>
                                            <div className="space-y-5">
                                                <div className="bg-white/80 p-5 rounded-3xl border border-pink-200/50">
                                                    <div className="flex items-end justify-between mb-2">
                                                        <p className="text-xs font-black uppercase text-pink-800 mt-1">Daily Score</p>
                                                        <p className="text-3xl font-black text-pink-600 tracking-tighter leading-none">{results.distractionManagement.dailyScore}%</p>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-pink-800/60 leading-tight">Your potential for distraction today is moderate. Use systematic blocks.</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-pink-800/60 tracking-widest mb-3">Tactical Advice</p>
                                                    <div className="space-y-2">
                                                        {results.distractionManagement.reductionTips.map((tip: string, i: number) => (
                                                            <div key={i} className="flex gap-3 text-xs font-bold text-pink-900/80 leading-relaxed">
                                                                <Lightbulb className="w-4 h-4 text-pink-500 flex-shrink-0" /> {tip}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Intelligent Insights */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] p-10 border border-blue-100 shadow-xl">
                                        <h3 className="text-2xl font-black text-indigo-900 mb-8 uppercase italic flex items-center gap-3">
                                            <Zap className="w-6 h-6 text-indigo-600" /> AI Insights & Optimization
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    <Sun className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-indigo-800/60 tracking-widest mb-1">Energy Optimization</p>
                                                    <p className="text-sm font-bold text-indigo-900 leading-relaxed">{results.aiSuggestions.scheduleOptimization}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    <Moon className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-indigo-800/60 tracking-widest mb-1">Sleep Improvement</p>
                                                    <p className="text-sm font-bold text-indigo-900 leading-relaxed">{results.aiSuggestions.sleepImprovement}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[3rem] p-10 border border-emerald-100 shadow-xl">
                                        <h3 className="text-2xl font-black text-emerald-900 mb-8 uppercase italic flex items-center gap-3">
                                            <Shield className="w-6 h-6 text-emerald-600" /> Adaptive Strategy
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-emerald-800/60 tracking-widest mb-3 flex items-center gap-2">
                                                    <AlertCircle className="w-3 h-3" /> If the routine breaks
                                                </p>
                                                <p className="text-sm font-bold text-emerald-900 leading-relaxed bg-white/50 p-4 rounded-2xl border border-emerald-100">{results.adaptiveLogic.ifRoutineFails}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-emerald-800/60 tracking-widest mb-3 flex items-center gap-2">
                                                    <Battery className="w-3 h-3" /> On low energy days
                                                </p>
                                                <p className="text-sm font-bold text-emerald-900 leading-relaxed bg-white/50 p-4 rounded-2xl border border-emerald-100">{results.adaptiveLogic.ifEnergyLow}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {!loading && !results && !error && (
                            <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50/50 border-4 border-dashed border-slate-200 rounded-[4rem] text-center p-12">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-12">
                                    <Clock className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-400 uppercase italic">Awaiting Peak Analytics</h3>
                                <p className="text-slate-400 max-w-sm mx-auto mt-4 font-bold text-lg leading-tight uppercase tracking-widest">
                                    Sync your tasks and energy profile to generate your masterpiece routine.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

