import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert HR professional specializing in performance management. Generate a comprehensive, fair, and constructive performance review document.\n\nInclude:\n1. Review period and employee summary\n2. Overall performance rating with justification\n3. Key accomplishments (with specific examples)\n4. Competency-based evaluation (select relevant areas: Communication, Execution, Collaboration, Innovation, Leadership, Technical Skills)\n5. Areas for development with specific suggestions\n6. Goals for the next review period (SMART goals)\n7. Manager's overall narrative (2-3 paragraphs)\n8. Development resources or recommendations\n\nBe specific, use examples from the input. Balance positive feedback with constructive criticism.`,
        },
        { role: "user", content: `Generate a performance review:\n\n${input}` },
      ],
      temperature: 0.6,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
