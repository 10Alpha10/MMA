'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Question, QuestionSchema } from '@/types/types'
import { experimental_useObject as useObject } from "ai/react"
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { AppLayout } from '@/components/app-layout'

// Dynamically import components that use browser APIs
const Submit = dynamic<{
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}>( 
  () => import('@/components/submit').then(mod => mod.Submit),
  { ssr: false }
)
const FileUpload = dynamic(() => import('@/components/file-upload').then(mod => mod.FileUpload), { ssr: false })
const QuestionList = dynamic<{ questions: Question[]; timeLimit?: number }>(
  () => import('@/components/question-list').then(mod => mod.QuestionList),
  { ssr: false }
)
const Select = dynamic(() => import('@/components/ui/select').then(mod => mod.Select), { ssr: false })
const SelectContent = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectContent), { ssr: false })
const SelectItem = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectItem), { ssr: false })
const SelectTrigger = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectTrigger), { ssr: false })
const SelectValue = dynamic(() => import('@/components/ui/select').then(mod => mod.SelectValue), { ssr: false })
const Label = dynamic(() => import('@/components/ui/label').then(mod => mod.Label), { ssr: false })
const ExpandedTextarea = dynamic(() => import('@/components/expanded-textarea').then(mod => mod.ExpandedTextarea), { ssr: false })
const NumberSelector = dynamic(() => import('@/components/number-selector').then(mod => mod.NumberSelector), { ssr: false })
const NavSidebar = dynamic(() => import('@/components/nav-sidebar').then(mod => mod.NavSidebar), { ssr: false })
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), { ssr: false })
const LoadingAnimation = dynamic(() => import('@/components/loading-animation').then(mod => mod.LoadingAnimation), { ssr: false })

export default function GeneratePage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [questionType, setQuestionType] = useState<'multiple-choice' | 'true-false' | 'short-answer' | 'mixed'>('mixed')
  const [questionCount, setQuestionCount] = useState(5)
  const [maxQuestions, setMaxQuestions] = useState(20)

  const { isLoading, object: result, submit, stop } = useObject({
    api: "/api/chat",
    schema: QuestionSchema,
  })

  const handleSubmit = async () => {
    submit({ input, fileContent, questionType, questionCount })
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/login') 
      } else {
        alert("Error during logout")
      }
    } catch (err) {
      console.error(err)
      alert("Logout failed")
    }
  }
  
  return (
    <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Suspense fallback={null}>
                  <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
                    ← Back
                  </Button>
                </Suspense>
              </Link>
            </div>

            <Suspense fallback={null}>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </Suspense>
          </div>
          
          <div className="space-y-4 mb-12 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-zinc-100 dark:to-white flex items-center justify-center gap-2">
              <Image 
                src="/icon.png" 
                width={56} 
                height={56} 
                alt="QuizMate Icon" 
              />
              QuizMate
            </h1>
            <p className="text-lg text-muted-foreground dark:text-zinc-300">
              Generate quiz questions from any given text using AI.
            </p>
          </div>

          <div className="space-y-10 mb-8">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Suspense fallback={null}>
                    <Label className="text-base font-medium">Source Material</Label>
                    <FileUpload onFileContent={setFileContent} />
                  </Suspense>
                  <div className="relative">
                    <Suspense fallback={null}>
                      <ExpandedTextarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Or type/paste your text here..."
                      />
                    </Suspense>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Question Type
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setQuestionType(
                          value as
                            | "multiple-choice"
                            | "true-false"
                            | "short-answer"
                            | "mixed"
                        )
                      }
                      value={questionType}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true-false">
                          True/False
                        </SelectItem>
                        <SelectItem value="short-answer">
                          Short Answer
                        </SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Number of Questions
                    </Label>
                    <NumberSelector
                      value={questionCount}
                      onChange={setQuestionCount}
                      min={1}
                      max={maxQuestions}
                      onMaxChange={setMaxQuestions}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <Suspense fallback={<div className="flex justify-center py-12">Loading...</div>}>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingAnimation />
                  </div>
                ) : (
                  <Submit
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={!input && !fileContent}
                  >
                    Generate Questions
                  </Submit>
                )}
              </Suspense>
              
              {result &&
                Array.isArray(result.questions) &&
                result.questions.length > 0 && (
                  <div className="pt-8 border-t border-border">
                    <Suspense fallback={null}>
                      <QuestionList
                        questions={result.questions as Question[]}
                      />
                    </Suspense>
                  </div>
                )}
            </div>
          </div>
        </div>
    </AppLayout>
  );
}
