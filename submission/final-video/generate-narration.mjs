import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");
const keyLine = env
  .split(/\r?\n/)
  .find((line) => line.startsWith("OPENAI_API_KEY="));

if (!keyLine) {
  throw new Error("OPENAI_API_KEY is missing from .env.local");
}

const apiKey = keyLine.slice("OPENAI_API_KEY=".length).trim();
const input = fs
  .readFileSync("submission/final-video/narration.txt", "utf8")
  .trim();

const response = await fetch("https://api.openai.com/v1/audio/speech", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4o-mini-tts",
    voice: "marin",
    input,
    response_format: "wav",
    instructions:
      "An adult woman speaking in a natural, contemporary British English accent. Warm, intelligent, and conversational, as if confidently demonstrating her own product to a small group. Use varied cadence, gentle emphasis, and brief pauses between ideas. Keep the delivery understated and authentic—never theatrical, overly posh, sales-like, or robotic. Pronounce GPT-5.6 as G P T five point six and Codex as code-ex. Aim for about 155 words per minute.",
  }),
});

if (!response.ok) {
  const message = (await response.text()).slice(0, 500);
  throw new Error(`OpenAI TTS failed (${response.status}): ${message}`);
}

const audio = Buffer.from(await response.arrayBuffer());
fs.writeFileSync("submission/final-video/narration-openai.wav", audio);
console.log(`Generated ${audio.byteLength} bytes of OpenAI narration.`);
