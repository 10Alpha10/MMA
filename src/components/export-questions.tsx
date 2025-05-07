'use client'

import { Question } from '@/types/types'
import { Download } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export interface ExportQuestionsProps {
    questions: Question[]
    timeLimit?: number
}

export function ExportQuestions({ questions, timeLimit }: ExportQuestionsProps) {
    const handleExport = () => {
        // Create a temporary div to hold our PDF content
        const element = document.createElement('div')
        element.style.padding = '20px'
        element.style.maxWidth = '800px'
        element.style.margin = '0 auto'
        element.style.fontFamily = 'Arial, sans-serif'

        // Add title and time limit if specified
        const title = document.createElement('h1')
        title.textContent = 'Questions and Answers'
        title.style.textAlign = 'center'
        title.style.marginBottom = '10px'
        title.style.color = '#000000'
        element.appendChild(title)

        if (timeLimit) {
            const timeLimitText = document.createElement('p')
            timeLimitText.textContent = `Time Limit: ${timeLimit} minutes`
            timeLimitText.style.textAlign = 'center'
            timeLimitText.style.marginBottom = '20px'
            timeLimitText.style.color = '#666666'
            element.appendChild(timeLimitText)
        }

        // Process only valid questions with required properties
        const validQuestions = questions.filter((q): q is NonNullable<Question> => {
            return q !== undefined && 
                   typeof q.question === 'string' && 
                   q.question.length > 0;
        });

        validQuestions.forEach((q, i) => {
            const questionDiv = document.createElement('div')
            questionDiv.style.marginBottom = '25px'
            questionDiv.style.padding = '15px'
            questionDiv.style.borderRadius = '8px'
            questionDiv.style.backgroundColor = '#ffffff'
            questionDiv.style.color = '#000000'

            // Question text
            const questionText = document.createElement('p')
            questionText.style.fontSize = '16px'
            questionText.style.fontWeight = 'bold'
            questionText.style.marginBottom = '10px'
            questionText.textContent = `${i + 1}. ${q.question}`
            questionDiv.appendChild(questionText)

            // Options for multiple choice
            if (q.type === 'multiple-choice' && Array.isArray(q.options) && q.options.length > 0) {
                const optionsList = document.createElement('ul')
                optionsList.style.listStyle = 'none'
                optionsList.style.paddingLeft = '20px'
                optionsList.style.marginBottom = '10px'

                q.options.forEach((opt, j) => {
                    const optionItem = document.createElement('li')
                    optionItem.style.marginBottom = '5px'
                    optionItem.textContent = `${String.fromCharCode(97 + j)}) ${opt}`
                    optionsList.appendChild(optionItem)
                })

                questionDiv.appendChild(optionsList)
            }

            // Correct answer
            if (q.correctAnswer !== undefined) {
                const answerText = document.createElement('p')
                answerText.style.fontSize = '14px'
                answerText.style.color = '#2d7447'
                answerText.style.marginTop = '10px'
                answerText.textContent = `Correct answer: ${
                    q.type === 'multiple-choice' && Array.isArray(q.options) && q.options.length > 0
                        ? q.options[q.correctAnswer as number] || q.correctAnswer
                        : q.correctAnswer
                }`
                questionDiv.appendChild(answerText)
            }

            element.appendChild(questionDiv)
        })

        // PDF options
        const opt = {
            margin: 1,
            filename: 'questions-and-answers.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }

        // Generate and download PDF
        html2pdf().from(element).set(opt).save()
    }

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            <Download className="w-4 h-4" />
            Export as PDF
        </button>
    )
}
