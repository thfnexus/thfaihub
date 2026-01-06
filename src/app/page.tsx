import Link from "next/link";
import { ArrowRight, Lock, Brain, TrendingUp, GraduationCap, Briefcase, UserCheck, CircleDollarSign, BookOpen, Layout, Clock, Calendar, Heart, CheckSquare } from "lucide-react";

export default function Home() {
  const tools = [
    {
      name: "AI Career Counselor",
      description: "Get personalized career guidance driven by AI analysis of your profile.",
      icon: <Briefcase className="w-8 h-8 mb-4 text-blue-500" />,
      href: "/tools/career-counselor",
      isActive: true,
    },
    {
      name: "Skills Analyzer",
      description: "Deeply analyze skill gaps and get a 2026-ready learning roadmap.",
      icon: <Brain className="w-8 h-8 mb-4 text-purple-500" />,
      href: "/tools/skills-analyzer",
      isActive: true,
    },
    {
      name: "Degree vs Skill Simulator",
      description: "Compare cost, risk, and ROI of degrees vs skills for your chosen path.",
      icon: <GraduationCap className="w-8 h-8 mb-4 text-green-500" />,
      href: "/tools/degree-vs-skill",
      isActive: true,
    },
    {
      name: "Income Sources",
      description: "Get a personalized roadmap of income sources based on your skills, time, and goals across immediate, mid-term, and long-term horizons.",
      icon: <CircleDollarSign className="w-8 h-8 mb-4 text-orange-500" />,
      href: "/tools/income-sources",
      isActive: true,
    },
    {
      name: "AI Interview Coach",
      description: "Practice interviews with AI and get real-time feedback on your answers and body language.",
      icon: <UserCheck className="w-8 h-8 mb-4 text-red-500" />,
      href: "/tools/interview-coach",
      isActive: true,
    },
    {
      name: "AI Scholarship Planner",
      description: "Find and track scholarships globally with live data and AI-matched eligibility requirements.",
      icon: <CircleDollarSign className="w-8 h-8 mb-4 text-emerald-500" />,
      href: "/tools/scholarship-planner",
      isActive: true,
    },
    {
      name: "AI Course Recommender",
      description: "Get ROI-focused course recommendations filtered by quality and job market demand.",
      icon: <BookOpen className="w-8 h-8 mb-4 text-indigo-500" />,
      href: "/tools/course-recommender",
      isActive: true,
    },
    {
      name: "AI Portfolio Builder",
      description: "Build a professional portfolio that meets real-world market standards using AI-guided templates.",
      icon: <Layout className="w-8 h-8 mb-4 text-cyan-500" />,
      href: "/tools/portfolio-builder",
      isActive: true,
    },
    {
      name: "AI Daily Routine Manager",
      description: "Get an energy-based daily schedule that prevents burnout, boosts focus, and adapts to your unique productivity patterns.",
      icon: <Clock className="w-8 h-8 mb-4 text-pink-500" />,
      href: "/tools/routine-manager",
      isActive: true,
    },
    {
      name: "AI Mental Health Companion",
      description: "AI-powered mental wellness support with mood tracking, stress management, and personalized coping strategies.",
      icon: <Heart className="w-8 h-8 mb-4 text-rose-500" />,
      href: "/tools/mental-health",
      isActive: false,
    },
    {
      name: "AI Study Plan Generator",
      description: "Generate optimized study plans based on your learning style, exam dates, and subject difficulty.",
      icon: <Calendar className="w-8 h-8 mb-4 text-violet-500" />,
      href: "/tools/study-planner",
      isActive: false,
    },
    {
      name: "AI Habit Tracker",
      description: "Build lasting habits with AI-powered tracking, streaks, accountability, and behavior pattern analysis.",
      icon: <CheckSquare className="w-8 h-8 mb-4 text-teal-500" />,
      href: "/tools/habit-tracker",
      isActive: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-32 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 italic uppercase">
          THF AI <span className="text-blue-600">Hub</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto mb-10 font-medium">
          The World's Most Advanced AI Career Architecture Suite. One Platform. One Account.
        </p>
        <div className="flex flex-col md:flex-row gap-5 justify-center">
          <Link
            href="#tools"
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Explore Neural Tools <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/pricing"
            className="px-10 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-800 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 px-4 container mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Neural Toolset</h2>
          <div className="w-20 h-1.5 bg-blue-600 mt-2 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group block p-6 border rounded-xl hover:shadow-lg transition-all bg-white relative overflow-hidden"
            >
              {!tool.isActive && (
                <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                  COMING SOON
                </div>
              )}
              {tool.isActive && (
                <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  LIVE
                </div>
              )}
              {tool.icon}
              <h3 className="text-xl font-black mb-2 text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                {tool.name}
              </h3>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
