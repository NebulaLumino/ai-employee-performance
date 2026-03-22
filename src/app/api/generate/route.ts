import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert HR professional specializing in performance management. Generate a comprehensive, fair, and constructive performance review.\n\nInclude: 1) Review period and employee summary 2) Overall performance rating with justification 3) Key accomplishments with specific examples 4) Competency-based evaluation 5) Areas for development with specific suggestions 6) SMART goals for next period 7) Manager's overall narrative 8) Development resources.\n\nBalance positive feedback with constructive criticism. Be specific and use examples from input." },
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
