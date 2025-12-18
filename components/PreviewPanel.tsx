"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Download, Eye, RotateCcw, Share2 } from "lucide-react";
import Image from "next/image";

interface PreviewPanelProps {
  site: any;
  onReset: () => void;
}

export default function PreviewPanel({ site, onReset }: PreviewPanelProps) {
  const handleDownload = () => {
    const blob = new Blob([site.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="glass rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{site.name}</h2>
          <p className="text-gray-300">Your website is ready!</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Live Preview</h3>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
          {/* Browser Chrome */}
          <div className="bg-gray-200 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
              {site.name.toLowerCase().replace(/\s+/g, "")}.com
            </div>
          </div>

          {/* Website Content */}
          <div
            className="overflow-auto"
            style={{ maxHeight: "600px" }}
            dangerouslySetInnerHTML={{ __html: site.html }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">SEO Metadata</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Title:</span>
              <p className="text-white">{site.metadata.title}</p>
            </div>
            <div>
              <span className="text-gray-400">Description:</span>
              <p className="text-white">{site.metadata.description}</p>
            </div>
            <div>
              <span className="text-gray-400">Keywords:</span>
              <p className="text-white">{site.metadata.keywords}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Design Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Industry:</span>
              <p className="text-white">{site.industry}</p>
            </div>
            <div>
              <span className="text-gray-400">Theme:</span>
              <p className="text-white">{site.theme}</p>
            </div>
            <div>
              <span className="text-gray-400">Color Palette:</span>
              <div className="flex gap-2 mt-2">
                {site.colors.map((color: string, i: number) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
