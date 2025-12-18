"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";

const INDUSTRIES = [
  "E-commerce", "SaaS", "Restaurant", "Portfolio", "Agency", "Healthcare",
  "Real Estate", "Education", "Finance", "Fitness", "Travel", "Legal",
  "Automotive", "Entertainment", "Non-Profit", "Technology", "Fashion",
  "Photography", "Consulting", "Manufacturing", "Media", "Gaming", "Sports", "Wellness"
];

const THEMES = [
  "Modern Minimal", "Glassmorphism", "Neumorphism", "Gradient Bold", "Dark Neon",
  "Corporate Clean", "Creative Vibrant", "Tech Futuristic", "Elegant Classic", "Brutalist",
  "Retro Vintage", "Organic Natural", "Luxury Premium", "Playful Fun", "Professional",
  "Artistic", "Cyberpunk", "Pastel Soft", "High Contrast", "Monochrome"
];

interface BuilderFormProps {
  onGenerate: (data: any) => void;
}

export default function BuilderForm({ onGenerate }: BuilderFormProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    theme: "",
    description: "",
    features: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-8 max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-6">Create Your Website</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Business Name *
          </label>
          <Input
            required
            placeholder="Acme Corp"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Industry *
          </label>
          <select
            required
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="bg-slate-900">Select an industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry} className="bg-slate-900">
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Design Theme *
          </label>
          <select
            required
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="bg-slate-900">Select a theme</option>
            {THEMES.map((theme) => (
              <option key={theme} value={theme} className="bg-slate-900">
                {theme}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description *
          </label>
          <Textarea
            required
            placeholder="Tell us about your business, goals, and target audience..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Features
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["Contact Form", "Newsletter", "Testimonials", "Booking", "E-commerce", "Blog"].map((feature) => (
              <label key={feature} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, features: [...formData.features, feature] });
                    } else {
                      setFormData({
                        ...formData,
                        features: formData.features.filter((f) => f !== feature),
                      });
                    }
                  }}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg rounded-xl"
        >
          Generate Website with AI
        </Button>
      </form>
    </motion.div>
  );
}
