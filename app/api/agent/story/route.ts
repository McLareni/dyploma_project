import { decrypt } from "@/utils/jwt";
import { NextResponse } from "next/server";

const TOKEN = process.env.AI_API_KEY;

const generateStoryPrompt = (prompt: string) => `
Your task: Based on any text or topic provided by the user, generate one story in English.

Rules:
1. Output only a JSON array with a single object.
2. The object must have:
{
  "topic of text": "<Topic of the story>",
  "text": "<story in English, min 150 characters max 250 characters>"
}
3. Do NOT include any explanations, <think> tags, markdown, or text outside the JSON array.
4. If the user's topic is inappropriate or unsafe, output 
{
    "topic of text": "Error", 
    "text": "I cannot generate a story that violates my safety rules."
} instead of generating a story.


User's topic or text: ${prompt}
`;

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { userId: number; text: string; language: string };
  try {
    body = await request.json();

    if (body.userId !== Number(result.userId)) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new NextResponse(JSON.stringify({ message: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "aisingapore/Gemma-SEA-LION-v4-27B-IT:publicai",
          messages: [
            {
              role: "system",
              content: "You must output ONLY JSON array, no explanations.",
            },
            {
              role: "user",
              content: generateStoryPrompt(body.text),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HF API error: ${text}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content);

    const rawWords = data.choices[0].message.content;
    const cleaned = rawWords
      .replace(/[‘’]/g, "'")
      .replace(/```json|```/g, "")
      .trim();

    let cleanedWords = JSON.parse(cleaned);
    if (!Array.isArray(cleanedWords)) throw new Error("Invalid JSON output");

    return NextResponse.json({
      generated_text: cleanedWords || "Немає результату",
    });
  } catch {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
