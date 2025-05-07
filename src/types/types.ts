import { z } from 'zod'

export interface GenerateQuestionsParams {
  input: string
  fileContent?: string
  questionType: string
  questionCount: number
}

export interface Question {
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  correctAnswer: string | number
  hint?: string
}

export const QuestionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      type: z.enum(['multiple-choice', 'true-false', 'short-answer']),
      options: z.array(z.string()).optional(),
      correctAnswer: z.union([z.string(), z.number()]),
      hint: z.string().optional()
    })
  )
})

export type QuestionSchemaType = z.infer<typeof QuestionSchema>

export interface Progress {
  id: string
  userId: string
  questionId: string
  correct: boolean
  attemptDate: string
}

export interface ProgressStats {
  totalAttempts: number
  correctAttempts: number
  accuracyRate: number
  dailyProgress: {
    date: string
    attempts: number
    correct: number
  }[]
}

export interface Note {
  id: string
  title: string
  content: string
  folder: string
  createdAt: string
  updatedAt: string
}
