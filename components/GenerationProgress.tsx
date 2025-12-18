"use client";

import { motion } from "framer-motion";
import { Bot, FileText, Palette, Plug, Sparkles } from "lucide-react";

interface GenerationProgressProps {
  progress: number;
}

const STAGES = [
  { icon: Bot, label: "Architect Agent", range: [0, 20] },
  { icon: FileText, label: "Copywriter Agent", range: [20, 50] },
  { icon: Palette, label: "Visual Agent", range: [50, 75] },
  { icon: Plug, label: "Integration Agent", range: [75, 100] },
];

export default function GenerationProgress({ progress }: GenerationProgressProps) {
  const currentStage = STAGES.findIndex(
    (stage) => progress >= stage.range[0] && progress < stage.range[1]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-8 max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-12 h-12 text-purple-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">AI Agents at Work</h2>
        <p className="text-gray-300">Building your perfect website...</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
          />
        </div>
        <div className="text-center mt-2 text-white font-semibold">{progress}%</div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === currentStage;
          const isComplete = progress > stage.range[1];

          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isActive
                  ? "bg-purple-500/20 border-2 border-purple-500"
                  : isComplete
                  ? "bg-green-500/20 border-2 border-green-500"
                  : "bg-white/5 border-2 border-white/10"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  isActive
                    ? "bg-purple-500"
                    : isComplete
                    ? "bg-green-500"
                    : "bg-white/10"
                }`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{stage.label}</p>
                <p className="text-sm text-gray-400">
                  {isComplete
                    ? "Complete"
                    : isActive
                    ? "In progress..."
                    : "Waiting"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
