import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function architectAgent(input: {
  businessName: string;
  industry: string;
  theme: string;
  description: string;
  features: string[];
}) {
  const prompt = `You are an expert web architect. Analyze this business and create a comprehensive site structure.

Business: ${input.businessName}
Industry: ${input.industry}
Theme: ${input.theme}
Description: ${input.description}
Features: ${input.features.join(", ")}

Provide a JSON response with:
1. siteStructure: Array of sections (e.g., Hero, About, Services, etc.)
2. designSystem: Color palette recommendations, typography, spacing
3. contentStrategy: Key messaging, CTAs, tone
4. technicalRequirements: Integrations needed

Keep it concise and production-ready.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}
