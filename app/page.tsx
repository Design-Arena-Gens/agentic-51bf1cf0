"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Code, Palette, Rocket } from "lucide-react";
import BuilderForm from "@/components/BuilderForm";
import GenerationProgress from "@/components/GenerationProgress";
import PreviewPanel from "@/components/PreviewPanel";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async (data: any) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.progress) {
              setProgress(data.progress);
            }

            if (data.complete) {
              setGeneratedSite(data.site);
              setIsGenerating(false);
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-200">AI-Powered Website Builder</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              NexaForge Pro
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let AI agents build your entire website. From design to deployment,
              fully automated with GPT-4 and DALL-E 3.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
              {[
                { icon: Code, label: "24 Industries", color: "purple" },
                { icon: Palette, label: "20 Themes", color: "pink" },
                { icon: Zap, label: "Auto SEO", color: "blue" },
                { icon: Rocket, label: "Deploy Ready", color: "cyan" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="glass rounded-xl p-6 hover:bg-white/15 transition-all"
                >
                  <feature.icon className={`w-8 h-8 mx-auto mb-2 text-${feature.color}-400`} />
                  <p className="text-white font-medium">{feature.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Interface */}
          <div className="max-w-7xl mx-auto">
            {!isGenerating && !generatedSite && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <BuilderForm onGenerate={handleGenerate} />
              </motion.div>
            )}

            {isGenerating && (
              <GenerationProgress progress={progress} />
            )}

            {generatedSite && !isGenerating && (
              <PreviewPanel site={generatedSite} onReset={() => setGeneratedSite(null)} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Powered by OpenAI GPT-4 & DALL-E 3 | Built with Next.js & Supabase</p>
        </div>
      </footer>
    </div>
  );
}
