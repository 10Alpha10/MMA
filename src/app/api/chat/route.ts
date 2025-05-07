import { GenerateQuestionsParams, QuestionSchema, Question } from "@/types/types";
import { ai } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        // Parse the incoming request
        const { input, fileContent, questionType, questionCount }: GenerateQuestionsParams = await req.json();

        // Validate question count
        if (questionCount > 20) {
            return new Response("The maximum number of questions is 20.", { status: 400 });
        }

        // Define the type prompt based on question type
        const typePrompt = questionType === 'mixed' ?
            'The questions can be multiple-choice, true-false, or short-answer.' :
            `The questions should be ${questionType.replace('-', ' ')}.`;

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
            ${fileContent}`;

        // Call the AI model to generate the content
        const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        
        if (!result.response) {
            throw new Error("Empty response from AI model");
        }

        const text = await result.response.text();
        if (!text) {
            throw new Error("Empty text from AI model");
        }

        // Parse the AI response
        console.log("Raw AI response:", text); // Debug log

        // Clean and parse the response
        const cleanedText = text
            .trim()
            .replace(/^```(?:json)?\s*/i, "") // Remove leading ```json
            .replace(/```$/, "")              // Remove trailing ```
            .replace(/^\s*\[/, '[')          // Ensure array starts immediately
            .replace(/\]\s*$/, ']');         // Ensure array ends cleanly
        
        console.log("Cleaned text:", cleanedText); // Debug log
        
        let parsedQuestions;
        try {
            // Attempt to parse the cleaned JSON
            parsedQuestions = JSON.parse(cleanedText);
            
            // Validate array structure
            if (!Array.isArray(parsedQuestions)) {
                throw new Error("Response is not an array");
            }
            
            // Validate each question object
            parsedQuestions.forEach((q, index) => {
                if (!q.question || !q.type) {
                    throw new Error(`Question at index ${index} is missing required fields`);
                }
            });

        } catch (e) {
            console.error("JSON parsing error. Response was:", cleanedText);
            console.error("Error details:", e);
            return new Response(
                JSON.stringify({ 
                    error: "Failed to parse questions",
                    details: e instanceof Error ? e.message : "Unknown error",
                    rawResponse: text.substring(0, 200) + "..." // Include start of raw response
                }), 
                { 
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Format and validate each question according to our schema
        const formattedQuestions = parsedQuestions.map((question: Partial<Question>) => ({
            question: question.question,
            type: question.type || 'short-answer',
            options: question.type === 'multiple-choice' ? question.options || [] : undefined,
            correctAnswer: question.correctAnswer,
            hint: question.hint
        }));

// Validate against schema
const validatedResult = QuestionSchema.parse({ questions: formattedQuestions });


        // Log the validated result for debugging
        console.log("Validated result:", JSON.stringify(validatedResult));

        // Return the generated questions as a response
        return new Response(JSON.stringify(validatedResult), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error generating questions:", error);
        return new Response("An error occurred while generating questions.", { status: 500 });
    }
}
