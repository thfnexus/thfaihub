'use client'

import { useState } from 'react'
import { Search, ChevronDown, Mail, Phone, Instagram, Facebook, Book, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [openFaq, setOpenFaq] = useState<string | null>(null)

    const faqs = [
        {
            category: 'Account & Profile',
            items: [
                {
                    id: 'acc1',
                    question: 'How do I create an account?',
                    answer: 'Click on "Sign Up" in the navbar, enter your Full Name, Username, Email, and Password. You\'ll receive 5 free credits to get started!'
                },
                {
                    id: 'acc2',
                    question: 'How can I update my profile information?',
                    answer: 'Go to Settings from the navbar and update your Full Name or Username. Your email cannot be changed for security reasons.'
                },
                {
                    id: 'acc3',
                    question: 'I forgot my password. What should I do?',
                    answer: 'Currently, please contact support at thfaihub@gmail.com to reset your password. A self-service reset feature is coming soon.'
                }
            ]
        },
        {
            category: 'Plans & Credits',
            items: [
                {
                    id: 'plan1',
                    question: 'What are credits and how do they work?',
                    answer: 'Credits are used to access AI tools. Each tool usage costs a certain number of credits. You can view your balance in the navbar.'
                },
                {
                    id: 'plan2',
                    question: 'How do I upgrade my plan?',
                    answer: 'Visit the Pricing page, select your desired plan (Pro or Premium), and complete the checkout process. Your credits will be updated instantly.'
                },
                {
                    id: 'plan3',
                    question: 'Can I downgrade or cancel my plan?',
                    answer: 'Yes, you can change your plan anytime. Contact support or manage it from your profile settings.'
                }
            ]
        },
        {
            category: 'Tools & Usage',
            items: [
                {
                    id: 'tool1',
                    question: 'Which AI tools are available?',
                    answer: 'We offer AI Career Counselor, Skills Analyzer, Degree vs Skill Analyzer, and Career Timeline Simulator. All tools are currently in "Coming Soon" mode.'
                },
                {
                    id: 'tool2',
                    question: 'How many credits does each tool cost?',
                    answer: 'Tool costs vary. Typically, basic queries cost 1-2 credits, while advanced analyses may cost more. This will be displayed when tools go live.'
                },
                {
                    id: 'tool3',
                    question: 'What happens if I run out of credits?',
                    answer: 'Tools will be locked until you purchase more credits or upgrade your plan. Free users get 5 credits daily.'
                }
            ]
        },
        {
            category: 'Billing & Payment',
            items: [
                {
                    id: 'bill1',
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit/debit cards. Payment processing is secure and encrypted.'
                },
                {
                    id: 'bill2',
                    question: 'Is there a refund policy?',
                    answer: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with our service. Contact support for refund requests.'
                },
                {
                    id: 'bill3',
                    question: 'Are payments recurring?',
                    answer: 'Yes, Pro and Premium plans are monthly subscriptions. You can cancel anytime before your next billing cycle.'
                }
            ]
        }
    ]

    const guides = [
        { title: 'How to use AI Career Counselor', link: '#' },
        { title: 'Understanding Credit System', link: '#' },
        { title: 'Maximizing tool accuracy', link: '#' },
        { title: 'Plan comparison guide', link: '#' }
    ]

    const toggleFaq = (id: string) => {
        setOpenFaq(openFaq === id ? null : id)
    }

    const filteredFaqs = faqs.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Support & Help Center</h1>
                    <p className="text-xl text-blue-100">Find answers, guides, and ways to contact us</p>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-12">
                {/* Search Bar */}
                <div className="mb-12">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

                    {filteredFaqs.length === 0 ? (
                        <p className="text-center text-gray-500">No results found for "{searchQuery}"</p>
                    ) : (
                        <div className="space-y-8">
                            {filteredFaqs.map((category) => (
                                <div key={category.category} className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">{category.category}</h3>
                                    <div className="space-y-2">
                                        {category.items.map((item) => (
                                            <div key={item.id} className="border-b border-gray-100 last:border-0">
                                                <button
                                                    onClick={() => toggleFaq(item.id)}
                                                    className="w-full text-left py-4 flex justify-between items-center hover:text-blue-600 transition-colors"
                                                >
                                                    <span className="font-medium pr-4">{item.question}</span>
                                                    <ChevronDown
                                                        className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === item.id ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                                {openFaq === item.id && (
                                                    <div className="pb-4 text-gray-600 leading-relaxed">
                                                        {item.answer}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tutorials Section */}
                <div className="mb-16 bg-white rounded-xl shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Book className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">Tutorials & Guides</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {guides.map((guide, index) => (
                            <Link
                                key={index}
                                href={guide.link}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <span className="font-medium group-hover:text-blue-600">{guide.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Still Need Help?</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                            <Mail className="w-8 h-8 mx-auto text-blue-400" />
                            <h3 className="font-bold">Email</h3>
                            <a href="mailto:thfaihub@gmail.com" className="text-blue-300 hover:text-blue-200 break-all">
                                thfaihub@gmail.com
                            </a>
                        </div>
                        <div className="space-y-2">
                            <Phone className="w-8 h-8 mx-auto text-green-400" />
                            <h3 className="font-bold">WhatsApp</h3>
                            <a href="https://wa.me/923423209895" target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-200">
                                +92-342-3209895
                            </a>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-center gap-4">
                                <Instagram className="w-8 h-8 text-pink-400" />
                                <Facebook className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="font-bold">Social Media</h3>
                            <div className="space-x-3">
                                <a href="https://instagram.com/thfaihub" target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-pink-200">
                                    @thfaihub
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href="mailto:thfaihub@gmail.com"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Send us a message
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
