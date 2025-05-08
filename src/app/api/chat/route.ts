import { GenerateQuestionsParams, QuestionSchema, Question } from "@/types/types"
import { ai } from "@/lib/gemini"
import { corsHeaders, handleOptions } from "@/lib/cors"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

// ✅ رد على طلب preflight
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req)
}

export async function POST(req: Request) {
  try {
    const { input, fileContent, questionType, questionCount }: GenerateQuestionsParams = await req.json()

    if (questionCount > 20) {
      return new Response("The maximum number of questions is 20.", { status: 400 })
    }

    const typePrompt =
      questionType === "mixed"
        ? "The questions can be multiple-choice, true-false, or short-answer."
        : `The questions should be ${questionType.replace("-", " ")}.`

    const prompt = `You are a JSON generator for educational questions.
Generate exactly ${questionCount} questions in valid JSON format.
${typePrompt}

Respond ONLY with a JSON array of objects, nothing else. Each object must have:
{
  "question": "the question text",
  "type": "multiple-choice" OR "true-false" OR "short-answer",
  "options": ["option1", "option2", ...] (only for multiple-choice),
  "correctAnswer":string or index of the correct option,
  "hint": "optional hint"
}

Content to generate questions from:
${input}
${fileContent}`

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(prompt)

    if (!result.response) throw new Error("Empty response from AI model")
    const text = await result.response.text()
    if (!text) throw new Error("Empty text from AI model")

    const cleanedText = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/, "")
      .replace(/^\s*\[/, "[")
      .replace(/\]\s*$/, "]")

    let parsedQuestions
    try {
      parsedQuestions = JSON.parse(cleanedText)

      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Response is not an array")
      }

      parsedQuestions.forEach((q, index) => {
        if (!q.question || !q.type) {
          throw new Error(`Question at index ${index} is missing required fields`)
        }
      })
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: "Failed to parse questions",
          details: e instanceof Error ? e.message : "Unknown error",
          rawResponse: text.substring(0, 200) + "...",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(req as NextRequest),
          },
        }
      )
    }

    const formattedQuestions = parsedQuestions.map((question: Partial<Question>) => ({
      question: question.question,
      type: question.type || "short-answer",
      options: question.type === "multiple-choice" ? question.options || [] : undefined,
      correctAnswer: question.correctAnswer,
      hint: question.hint,
    }))

    const validatedResult = QuestionSchema.parse({ questions: formattedQuestions })

    return new Response(JSON.stringify(validatedResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(req as NextRequest),
      },
    })
  } catch (error) {
    console.error("Error generating questions:", error)
    return new Response("An error occurred while generating questions.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        ...(req instanceof Request ? corsHeaders(req as NextRequest) : {}),
      },
    })
  }
}
