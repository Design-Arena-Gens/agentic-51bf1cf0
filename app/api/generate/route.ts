import { NextRequest } from "next/server";
import { generateWebsite } from "@/lib/generator";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const data = await req.json();

        const sendProgress = (progress: number) => {
          const message = `data: ${JSON.stringify({ progress })}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        const site = await generateWebsite(data, sendProgress);

        const completeMessage = `data: ${JSON.stringify({
          complete: true,
          site,
        })}\n\n`;
        controller.enqueue(encoder.encode(completeMessage));

        controller.close();
      } catch (error) {
        console.error("Generation error:", error);
        const errorMessage = `data: ${JSON.stringify({
          error: "Generation failed",
        })}\n\n`;
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
