import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const { aiModel, analysisTypes, chartData, newsData } = await req.json();

    let prompt = `
You are a financial analysis assistant. Analyze Bitcoin using the following inputs:

${analysisTypes.includes("news") ? `News Data:\n${JSON.stringify(newsData, null, 2)}` : ""}
${analysisTypes.includes("chart") ? `Chart Data:\n${JSON.stringify(chartData, null, 2)}` : ""}

Return response in JSON:
{
  "summary": "...",
  "sentiment": "bullish/bearish/neutral",
  "position": "long/short/hold",
  "confidence": "high/medium/low",
  "keyFactors": ["...", "..."]
}
    `;

    let result;

    // --- ChatGPT (OpenAI) ---
    if (aiModel === "ChatGPT") {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      result = response.choices[0].message?.content;
    }

    // --- Gemini (Google) ---
    if (aiModel === "Gemini") {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const response = await model.generateContent(prompt);
      result = response.response.text();
    }

    // --- Claude (Anthropic) ---
    if (aiModel === "Claude") {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
      });
      result = response.content[0].text;
    }

    return NextResponse.json({ analysis: result });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
