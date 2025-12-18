import { architectAgent } from "./agents/architect";
import { copywriterAgent } from "./agents/copywriter";
import { visualAgent } from "./agents/visual";
import { integrationAgent } from "./agents/integration";

export async function generateWebsite(
  input: any,
  onProgress: (progress: number) => void
) {
  // Stage 1: Architecture (0-20%)
  onProgress(5);
  const architecture = await architectAgent(input);
  onProgress(20);

  // Stage 2: Copywriting (20-50%)
  onProgress(25);
  const content = await copywriterAgent(input, architecture);
  onProgress(50);

  // Stage 3: Visuals (50-75%)
  onProgress(55);
  const visuals = await visualAgent(input, architecture, content);
  onProgress(75);

  // Stage 4: Integrations (75-100%)
  onProgress(80);
  const integrations = await integrationAgent(input, input.features);
  onProgress(90);

  // Generate final HTML
  const html = generateHTML({
    businessName: input.businessName,
    content,
    visuals,
    integrations,
    architecture,
  });

  onProgress(100);

  return {
    name: input.businessName,
    industry: input.industry,
    theme: input.theme,
    html,
    metadata: content.metadata,
    colors: visuals.colors,
    architecture,
    integrations,
  };
}

function generateHTML(data: any) {
  const { businessName, content, visuals, integrations } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.metadata?.title || businessName}</title>
  <meta name="description" content="${content.metadata?.description || ""}">
  <meta name="keywords" content="${content.metadata?.keywords || ""}">

  ${content.jsonLd ? `<script type="application/ld+json">${JSON.stringify(content.jsonLd)}</script>` : ""}

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${visuals.colors[0]}',
            secondary: '${visuals.colors[1]}',
            accent: '${visuals.colors[2]}',
          }
        }
      }
    }
  </script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * {
      font-family: 'Inter', sans-serif;
    }

    .hero-gradient {
      background: linear-gradient(135deg, ${visuals.colors[0]} 0%, ${visuals.colors[1]} 50%, ${visuals.colors[2]} 100%);
    }

    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .neumorphic {
      box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.2),
                  -12px -12px 24px rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body class="antialiased">
  <!-- Navigation -->
  <nav class="fixed w-full top-0 z-50 glass">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-bold" style="color: ${visuals.colors[0]}">${businessName}</div>
        <div class="hidden md:flex gap-6">
          <a href="#home" class="hover:text-primary transition">Home</a>
          <a href="#about" class="hover:text-primary transition">About</a>
          <a href="#services" class="hover:text-primary transition">Services</a>
          <a href="#contact" class="hover:text-primary transition">Contact</a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="home" class="min-h-screen flex items-center justify-center hero-gradient text-white pt-20">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-5xl md:text-7xl font-bold mb-6">
        ${content.headline || `Welcome to ${businessName}`}
      </h1>
      <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
        ${content.subheadline || "Your trusted partner for excellence"}
      </p>
      ${visuals.heroImage ? `
      <div class="mb-8">
        <img src="${visuals.heroImage}" alt="Hero" class="mx-auto rounded-2xl shadow-2xl max-w-4xl w-full" />
      </div>
      ` : ""}
      <button class="bg-white text-primary font-semibold px-8 py-4 rounded-full hover:scale-105 transition transform">
        ${content.ctaText || "Get Started"}
      </button>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-12" style="color: ${visuals.colors[0]}">
        ${content.sections?.about?.title || "About Us"}
      </h2>
      <p class="text-lg text-gray-700 max-w-3xl mx-auto text-center">
        ${content.sections?.about?.content || `${businessName} is dedicated to providing exceptional service and value to our clients.`}
      </p>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-12" style="color: ${visuals.colors[0]}">
        ${content.sections?.services?.title || "Our Services"}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${generateServiceCards(content.sections?.services?.items || [], visuals.colors)}
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-12" style="color: ${visuals.colors[0]}">
        Get In Touch
      </h2>
      ${integrations.forms?.find((f: any) => f.type === "contact")?.html || generateDefaultContactForm(visuals.colors[0])}
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 text-white" style="background-color: ${visuals.colors[0]}">
    <div class="container mx-auto px-4 text-center">
      <h3 class="text-2xl font-bold mb-4">${businessName}</h3>
      <p class="opacity-90">&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      ${integrations.forms?.find((f: any) => f.type === "newsletter") ? `
        <div class="mt-8">
          <h4 class="text-lg font-semibold mb-4">Subscribe to our newsletter</h4>
          ${integrations.forms.find((f: any) => f.type === "newsletter").html}
        </div>
      ` : ""}
    </div>
  </footer>

  ${integrations.analytics?.googleAnalytics || ""}
</body>
</html>`;
}

function generateServiceCards(items: any[], colors: string[]) {
  if (!items || items.length === 0) {
    items = [
      { title: "Service 1", description: "High-quality service tailored to your needs" },
      { title: "Service 2", description: "Expert solutions for your business" },
      { title: "Service 3", description: "Reliable support and consultation" },
    ];
  }

  return items
    .map(
      (item: any, i: number) => `
    <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
      <div class="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style="background-color: ${colors[i % colors.length]}20">
        <span class="text-3xl" style="color: ${colors[i % colors.length]}">✓</span>
      </div>
      <h3 class="text-2xl font-bold mb-4" style="color: ${colors[0]}">${item.title}</h3>
      <p class="text-gray-600">${item.description}</p>
    </div>
  `
    )
    .join("");
}

function generateDefaultContactForm(primaryColor: string) {
  return `
    <form class="space-y-4 max-w-md mx-auto">
      <div>
        <label class="block text-sm font-medium mb-2">Name</label>
        <input type="text" required class="w-full px-4 py-2 rounded-lg border-2 focus:outline-none" style="border-color: ${primaryColor}40; focus:border-color: ${primaryColor}" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input type="email" required class="w-full px-4 py-2 rounded-lg border-2 focus:outline-none" style="border-color: ${primaryColor}40" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Message</label>
        <textarea rows="4" required class="w-full px-4 py-2 rounded-lg border-2 focus:outline-none" style="border-color: ${primaryColor}40"></textarea>
      </div>
      <button type="submit" class="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition" style="background-color: ${primaryColor}">
        Send Message
      </button>
    </form>
  `;
}
