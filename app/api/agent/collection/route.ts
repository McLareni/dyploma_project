import { decrypt } from "@/utils/jwt";
import { NextResponse } from "next/server";

const TOKEN = process.env.AI_API_KEY;

const genarateNewWords = (prompt: string, language: string) => `
Your task: Based on the topic provided by the user, generate **ONLY a JSON array** of words.

Rules:
1. The output must be a JSON array: [ {...}, {...}, ... ]
2. Each item in the array must be an object with this structure:
   { "word": "<word in English>", "translation": "<translation in ${language}>" }
3. Use **double quotes** only.
4. Do NOT include explanations, markdown, or text outside the array.

Topic: ${prompt}
MAX 25 words
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
              content: genarateNewWords(body.text, body.language),
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
