import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function copywriterAgent(
  businessInfo: any,
  architecture: any
) {
  const prompt = `You are an expert copywriter and SEO specialist. Create compelling, SEO-optimized content for this website.

Business: ${businessInfo.businessName}
Industry: ${businessInfo.industry}
Description: ${businessInfo.description}
Site Structure: ${JSON.stringify(architecture.siteStructure)}
Content Strategy: ${JSON.stringify(architecture.contentStrategy)}

Generate:
1. headline: Compelling main headline
2. subheadline: Supporting subheadline
3. sections: Content for each section in the structure
4. metadata: SEO title, description, keywords
5. ctaText: Call-to-action buttons
6. jsonLd: JSON-LD structured data for SEO

Make it engaging, conversion-focused, and SEO-optimized. Return as JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}
