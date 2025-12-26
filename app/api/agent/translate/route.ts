import { decrypt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TOKEN = process.env.AI_API_KEY;

const translate = (text: string, target: string, from: string) => `
Your task: Based on the text provided by the user, translate it from English to ${target}.

Rules:
1. Output only a JSON array with a single object.
2. The object must have:
{
  "original text": "<The original text in ${from}>",
  "translated text": "<The translated text in ${target}>"
  "alternative translations": ["<alternative translation 1>", "<alternative translation 2>", "..."]
}
3. Do NOT include any explanations, markdown, or text outside the JSON array.
4. If the text is inappropriate, output:
[{"original text": "<original>", "translated text": "Error: content not allowed", "alternative translations": []}]

user's text to translate: ${text}
`;

export async function POST(request: Request) {
  const token =
    request.headers.get("Authorization")?.split(" ")[1] ||
    (await cookies()).get("session")?.value;
  const result = await decrypt(token);

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { userId: number; text: string; target: string; from: string };
  try {
    body = await request.json();

    if (Number(body.userId) !== Number(result.userId)) {
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
              content: translate(body.text, body.target, body.from),
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

    let translation = JSON.parse(cleaned);

    return NextResponse.json({
      generated_text: translation[0] || "Немає результату",
    });
  } catch {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
