import { ai } from "@/lib/gemini";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { userAnswer, correctAnswer } = await req.json();

        const prompt = `You are a quiz grader. Compare these two answers and respond with true if they convey the same basic meaning (even with variations in style, phrasing, or use of synonyms) or false if the meaning differs significantly.

Correct answer: "${correctAnswer}"
User answer: "${userAnswer}"

Respond ONLY with true or false, no other text.`;

        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        if (!result.response) {
            throw new Error("Failed to check answer");
        }

        const text = await result.response.text();
        if (!text) {
            throw new Error("Empty response from AI model");
        }

        const isCorrect = text.trim().toLowerCase() === 'true';

        return new Response(JSON.stringify({ isCorrect }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error checking answer:", error);
        return new Response("An error occurred while checking the answer.", { status: 500 });
    }
}
