"use client";

import { useState } from "react";
import { Submit } from "./submit";
import { Question } from "@/types/types";
import { ExportQuestions } from "./export-questions";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface QuestionListProps {
    questions: Question[];
    timeLimit?: number; 
}

export function QuestionList({ questions, timeLimit }: QuestionListProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<(number | string)[]>(new Array(questions.length).fill(null));
    const [showResults, setShowResults] = useState(false);
    const [showHint, setShowHint] = useState<number[]>([]);
    const [answerResults, setAnswerResults] = useState<boolean[]>(new Array(questions.length).fill(false));
    const [isChecking, setIsChecking] = useState(false);

    const handleAnswerSelect = (questionIndex: number, answer: number | string) => {
        setSelectedAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[questionIndex] = answer;
            return newAnswers;
        });
    };

    const checkShortAnswer = async (userAnswer: string, correctAnswer: string) => {
        try {
            const response = await fetch('/api/check-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAnswer, correctAnswer })
            });
            const { isCorrect } = await response.json();
            return isCorrect;
        } catch (error) {
            alert("حدث خطأ أثناء التحقق من الإجابة. يرجى المحاولة لاحقًا.");
            console.error("Error checking short answer:", error);
            return false;
        }
    };

    const checkAnswerCorrectness = async (questionIndex: number) => {
        const question = questions[questionIndex];
        const selectedAnswer = selectedAnswers[questionIndex];

        if (!question) return false;

        if (question.type === "true-false") {
            return String(selectedAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase();
        }

        if (question.type === "short-answer") {
            return await checkShortAnswer(String(selectedAnswer), String(question.correctAnswer));
        }

        return selectedAnswer === question.correctAnswer;
    };

    const handleCheckAnswers = async () => {
        setIsChecking(true);
        const results = await Promise.all(questions.map((_, index) => checkAnswerCorrectness(index)));
        setAnswerResults(results);
        setShowResults(true);
        
        // Save progress data to localStorage
        const storedProgress = localStorage.getItem('progressData');
        const existingProgress = storedProgress ? JSON.parse(storedProgress) : [];
        
        const newProgress = questions.map((question, index) => ({
            questionId: question.question,
            correct: results[index],
            attemptDate: new Date().toISOString(),
            userId: 'anonymous'
        }));
        
        localStorage.setItem('progressData', JSON.stringify([...existingProgress, ...newProgress]));
        
        // Dispatch storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'progressData',
            newValue: JSON.stringify([...existingProgress, ...newProgress])
        }));
        
        setIsChecking(false);
    };

    const toggleHint = (index: number) => {
        setShowHint(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    };

    const handleRetakeQuiz = () => {
        setSelectedAnswers(new Array(questions.length).fill(null));
        setShowResults(false);
        setAnswerResults(new Array(questions.length).fill(false));
        setShowHint([]);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{showResults ? "Results" : "Questions"}</h2>
                
                {showResults && <ExportQuestions questions={questions} timeLimit={timeLimit} />}
            </div>
        
            {questions.map((question, qIndex) => (
                <div
                    key={qIndex}
                    className={`p-6 rounded-xl border ${
                        showResults
                            ? answerResults[qIndex]
                                ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/10"
                                : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10"
                            : "border-gray-200 dark:border-gray-800"
                    }`}
                >
                    <div className="flex gap-3">
                        <span className="text-lg font-medium">{qIndex + 1}.</span>
                        <div className="space-y-4 flex-1">
                            {question && (
                                <>
                                    <h3 className="text-lg font-medium">{question.question}</h3>
                                    <div className="space-y-2">
                                        {question.type === "multiple-choice" && question.options?.map((option, oIndex) => (
                                            <button
                                                key={oIndex}
                                                onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                    selectedAnswers[qIndex] === oIndex
                                                        ? "border-black bg-gray-50 dark:border-white dark:bg-gray-900"
                                                        : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                        {question.type === "true-false" && (
                                            <>
                                                <button
                                                    onClick={() => handleAnswerSelect(qIndex, "true")}
                                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                        selectedAnswers[qIndex] === "true"
                                                            ? "border-black bg-gray-50 dark:border-white dark:bg-gray-900"
                                                            : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
                                                    }`}
                                                >
                                                    True
                                                </button>
                                                <button
                                                    onClick={() => handleAnswerSelect(qIndex, "false")}
                                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                        selectedAnswers[qIndex] === "false"
                                                            ? "border-black bg-gray-50 dark:border-white dark:bg-gray-900"
                                                            : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
                                                    }`}
                                                >
                                                    False
                                                </button>
                                            </>
                                        )}
                                        {question.type === "short-answer" && (
                                            <input
                                                type="text"
                                                onChange={(e) => handleAnswerSelect(qIndex, e.target.value)}
                                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        )}
                                    </div>
                                    {question?.hint && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => toggleHint(qIndex)}
                                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                <HelpCircle className="w-4 h-4" />
                                                {showHint.includes(qIndex) ? "Hide hint" : "Show hint"}
                                            </button>
                                            {showHint.includes(qIndex) && (
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{question.hint}</p>
                                            )}
                                        </div>
                                    )}
                                    {showResults && (
                                        <div className="flex items-center gap-2 mt-4 text-sm">
                                            {answerResults[qIndex] ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    <span className="text-green-600 dark:text-green-400">Correct!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                    <span className="text-red-600 dark:text-red-400">
                                                        Incorrect. The correct answer was:{" "}
                                                        {question.type === "multiple-choice" && question.options
                                                            ? question.options[question.correctAnswer as number]
                                                            : question.correctAnswer}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        
            {!showResults && (
                <Submit 
                    onClick={handleCheckAnswers} 
                    loading={isChecking} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    Check Answer
                </Submit>
            )}
        
            {showResults && (
                <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Summary</h3>
                        <p>Correct: {answerResults.filter(result => result).length} out of {questions.length}</p>
                    </div>
                    <Submit 
                        onClick={handleRetakeQuiz} 
                        loading={false} 
                        className="bg-yellow-700 hover:bg-yellow-800 text-white"
                    >
                        Retake Quiz
                    </Submit>
                </div>
            )}
        </div>
    );
}
