import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { symbol, aiModel, analysisTypes, chartData, newsData } = await req.json();

    // Define JSON schema for analysis output (symbol-agnostic)
    const analysisSchema = {
      name: "market_analysis",
      schema: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: `Brief summary of ${symbol}'s current situation based on the inputs.`,
          },
          sentiment: {
            type: "string",
            enum: ["bullish", "bearish", "neutral"],
            description: `Market sentiment for ${symbol}.`,
          },
          position: {
            type: "string",
            enum: ["long", "short", "hold"],
            description: `Suggested trading position for ${symbol}.`,
          },
          confidence: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "Confidence level of the analysis.",
          },
        },
        required: ["summary", "sentiment", "position", "confidence"],
        additionalProperties: false,
      },
    };

    // Dynamic prompt with symbol
    const prompt = `
You are a financial analysis assistant. Analyze ${symbol} using the following inputs:

${analysisTypes.includes("news") ? `News Data:\n${JSON.stringify(newsData, null, 2)}` : ""}
${analysisTypes.includes("chart") ? `Chart Data:\n${JSON.stringify(chartData, null, 2)}` : ""}

Return the result strictly following the provided JSON schema.
    `;

    const client = new OpenAI({
      apiKey: process.env.AVALAI_API_KEY,
      baseURL: "https://api.avalai.ir/v1",
    });

    const response = await client.chat.completions.create({
      model:
        aiModel === "ChatGPT"
          ? "gpt-4o"
          : aiModel === "Gemini"
          ? "gemini-2.0-flash-lite"
          : "grok-3-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_schema", json_schema: analysisSchema },
    });

    const result = response.choices[0].message?.content;

    return NextResponse.json({ analysis: JSON.parse(result!) });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
