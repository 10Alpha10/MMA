'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('currentUser='))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader isLoggedIn={isLoggedIn} isLandingPage={true} />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] py-8 md:py-0 flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-0 md:pr-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Generate Quiz Questions with AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
            Transform any text or document into engaging quiz questions in seconds. Perfect for educators, students, and learning enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Create Questions
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[85vw] sm:max-w-md min-h-[300px] sm:min-h-[350px] md:min-h-[400px] bg-secondary dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-10 bg-primary/10 dark:bg-gray-700 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="pt-12 px-6 pb-6">
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow">
                  <p className="font-medium">What is the main purpose of QuizMate?</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-border rounded-full mr-2"></div>
                      <p>To create social media content</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <p className="font-medium">To generate quiz questions from text</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-border rounded-full mr-2"></div>
                      <p className="text-foreground">To translate documents</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow">
                  <p className="font-medium">QuizMate supports which question types?</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <p className="font-medium">Multiple choice, true/false, and short answer</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full mr-2"></div>
                      <p>Only multiple choice</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full mr-2"></div>
                      <p>Essay questions only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary dark:bg-gray-900 py-8 sm:py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-gray-100">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Image 
                  src="/file.svg" 
                  alt="File Upload" 
                  width={24} 
                  height={24}
                  className="dark:invert"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Text & File Upload</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Upload text files or paste content directly to generate questions from any source material.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Image 
                  src="/window.svg" 
                  alt="Question Types" 
                  width={24} 
                  height={24}
                  className="dark:invert"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Multiple Question Types</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Create multiple-choice, true/false, or short-answer questions to suit your learning objectives.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Image 
                  src="/globe.svg" 
                  alt="AI Powered" 
                  width={24} 
                  height={24}
                  className="dark:invert"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">AI-Powered Generation</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Leverage advanced AI to create relevant, challenging questions that test understanding.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-gray-100"><path d="M4 19h16"/><path d="M4 14h16"/><path d="M4 9h16"/><path d="M4 4h16"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Todo List</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Stay organized with our integrated todo list. Track tasks, mark completions, and manage your workflow efficiently.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-gray-100"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Bookmarks</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              Save and organize your important links. Categorize bookmarks and access them quickly from any device.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-gray-100"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">PDF Export</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Export your quizzes and answers as PDF files for easy sharing, printing, and offline use.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-gray-100"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Track Your Progress</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Monitor your learning journey with detailed progress tracking, performance metrics, and improvement insights.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-gray-100"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Time Table Creator</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Create and manage study schedules, organize quiz sessions, and plan your learning activities efficiently.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-border h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-gray-100"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Study Notes</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Take and organize study notes with rich text formatting, attach them to quizzes, and enhance your learning experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
            Ready to create your quiz?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-700 dark:text-gray-300">
            Start generating high-quality questions in seconds.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary dark:bg-gray-800 py-6 sm:py-8 px-4 sm:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Image 
              src="/icon.png" 
              alt="QuizMate Logo" 
              width={30} 
              height={30}
              className="dark:invert"
            />
            <span className="text-gray-900 dark:text-gray-100 font-medium">QuizMate</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 QuizMate. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0"></div>
        </div>
      </footer>
    </div>
  )
}
