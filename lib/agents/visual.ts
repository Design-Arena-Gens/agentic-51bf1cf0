import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function visualAgent(
  businessInfo: any,
  architecture: any,
  content: any
) {
  // Generate hero image with DALL-E
  let heroImage = null;
  try {
    const imagePrompt = `Professional hero image for ${businessInfo.businessName}, a ${businessInfo.industry} business. ${businessInfo.theme} style. High quality, modern, clean, no text.`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
    });

    if (imageResponse.data && imageResponse.data.length > 0) {
      heroImage = imageResponse.data[0].url;
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }

  // Generate color palette based on theme
  const colorPrompt = `Generate a color palette for a ${businessInfo.theme} themed ${businessInfo.industry} website.
  Provide 5 colors in hex format that work well together. Return as JSON with array called "colors".`;

  const colorCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: colorPrompt }],
    response_format: { type: "json_object" },
  });

  const colorData = JSON.parse(colorCompletion.choices[0].message.content || "{}");

  // Select design effects based on theme
  const effects = selectDesignEffects(businessInfo.theme);

  return {
    heroImage,
    colors: colorData.colors || ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"],
    effects,
    typography: selectTypography(businessInfo.theme),
  };
}

function selectDesignEffects(theme: string) {
  const effectMap: Record<string, string[]> = {
    Glassmorphism: ["backdrop-blur-lg", "bg-white/10", "border border-white/20"],
    Neumorphism: ["shadow-neumorphic"],
    "Modern Minimal": ["shadow-lg"],
    "Gradient Bold": ["bg-gradient-to-r"],
    "Dark Neon": ["shadow-neon", "border-2"],
  };

  return effectMap[theme] || ["shadow-lg"];
}

function selectTypography(theme: string) {
  const typographyMap: Record<string, any> = {
    "Modern Minimal": { heading: "font-sans", body: "font-sans" },
    "Elegant Classic": { heading: "font-serif", body: "font-serif" },
    "Tech Futuristic": { heading: "font-mono", body: "font-sans" },
  };

  return typographyMap[theme] || { heading: "font-sans", body: "font-sans" };
}
