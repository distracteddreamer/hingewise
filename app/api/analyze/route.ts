import { NextRequest, NextResponse } from "next/server";

type Input = { concept?: unknown; explanation?: unknown };

const DEMO_ANALYSIS = {
  concept: "The seasons",
  diagnosis: "You correctly connect distance with heat, but assume distance is what changes our seasons. The hidden hinge is treating Earth's orbit like a dramatic in-and-out journey.",
  detected_belief: "Earth's changing distance from the Sun causes summer and winter.",
  why_it_feels_true: "Standing closer to a fire feels warmer, and textbook orbit diagrams are often stretched into an oval—so the distance story feels obvious.",
  repair: "Seasons come mainly from Earth's axial tilt. Tilt changes the angle and duration of sunlight in each hemisphere; distance cannot explain opposite seasons north and south.",
  nodes: [
    { id: "n1", label: "The Sun is Earth's main heat source", detail: "This foundation is sound: nearly all surface energy begins as sunlight.", kind: "sound" },
    { id: "n2", label: "Closer usually means more intense energy", detail: "Also reasonable in isolation. The issue is whether Earth's distance changes enough—and for whom.", kind: "sound" },
    { id: "n3", label: "Earth moves much closer during summer", detail: "This is the hinge. The orbit is nearly circular, and the whole planet shares the same distance at once.", kind: "hinge" },
    { id: "n4", label: "So both hemispheres should warm together", detail: "But July is summer in the north and winter in the south. Distance predicts the wrong pattern.", kind: "misconception" },
  ],
  repaired_nodes: [
    { id: "r1", label: "The Sun is Earth's main heat source", detail: "This stays in place. The correction does not discard the learner's sound foundation.", kind: "sound" },
    { id: "r2", label: "Earth's axis is tilted as it orbits", detail: "This replaces the distance assumption with the feature that actually changes illumination by hemisphere.", kind: "hinge" },
    { id: "r3", label: "Tilt changes ray angle and day length", detail: "A hemisphere tilted toward the Sun receives more direct light for more hours each day.", kind: "sound" },
    { id: "r4", label: "Opposite hemispheres get opposite seasons", detail: "The repaired model now predicts the Canada–Argentina pattern that distance could not explain.", kind: "sound" },
  ],
  challenge: {
    prompt: "In July, Earth is one distance from the Sun. Why can Canada be in summer while Argentina is in winter?",
    hint: "Look at which hemisphere tilts toward the Sun—and what that does to the angle and length of daylight.",
    answer: "Earth's tilt points the Northern Hemisphere toward the Sun in July, producing longer days and more direct rays there; the Southern Hemisphere gets shorter days and lower-angle rays. Same distance, opposite seasons.",
  },
  transfer_question: "If Earth's orbit became perfectly circular, would seasons disappear? Explain why.",
  model: "gpt-5.6",
  mode: "demo" as const,
};

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["concept", "diagnosis", "detected_belief", "why_it_feels_true", "repair", "nodes", "repaired_nodes", "challenge", "transfer_question"],
  properties: {
    concept: { type: "string" },
    diagnosis: { type: "string" },
    detected_belief: { type: "string" },
    why_it_feels_true: { type: "string" },
    repair: { type: "string" },
    nodes: {
      type: "array", minItems: 3, maxItems: 5,
      items: {
        type: "object", additionalProperties: false,
        required: ["id", "label", "detail", "kind"],
        properties: {
          id: { type: "string" }, label: { type: "string" }, detail: { type: "string" },
          kind: { type: "string", enum: ["sound", "hinge", "misconception"] },
        },
      },
    },
    repaired_nodes: {
      type: "array", minItems: 3, maxItems: 5,
      items: {
        type: "object", additionalProperties: false,
        required: ["id", "label", "detail", "kind"],
        properties: {
          id: { type: "string" }, label: { type: "string" }, detail: { type: "string" },
          kind: { type: "string", enum: ["sound", "hinge", "misconception"] },
        },
      },
    },
    challenge: {
      type: "object", additionalProperties: false,
      required: ["prompt", "hint", "answer"],
      properties: { prompt: { type: "string" }, hint: { type: "string" }, answer: { type: "string" } },
    },
    transfer_question: { type: "string" },
  },
};

function isDemoExample(concept: string, explanation: string) {
  const combined = `${concept} ${explanation}`.toLowerCase();
  return combined.includes("season") && combined.includes("closer") && combined.includes("sun");
}

export async function POST(request: NextRequest) {
  let body: Input;
  try {
    body = await request.json() as Input;
  } catch {
    return NextResponse.json({ error: "Send a concept and explanation as JSON." }, { status: 400 });
  }

  const concept = typeof body.concept === "string" ? body.concept.trim() : "";
  const explanation = typeof body.explanation === "string" ? body.explanation.trim() : "";
  if (concept.length < 2 || concept.length > 100 || explanation.length < 20 || explanation.length > 1200) {
    return NextResponse.json({ error: "Add a short topic and an explanation between 20 and 1,200 characters." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (isDemoExample(concept, explanation)) return NextResponse.json(DEMO_ANALYSIS);
    return NextResponse.json({ error: "Live analysis is not configured yet. Choose ‘Use example’ to try the complete judge-safe demo." }, { status: 503 });
  }

  const instructions = `You are a diagnostic learning scientist, not a generic tutor. Analyze a learner's explanation to locate the earliest plausible belief that causes later errors. Preserve what is correct. Build nodes as the learner's causal reasoning trace. Then build repaired_nodes as a parallel trace showing the smallest possible change: keep sound foundations, replace the hinge, and show how downstream conclusions realign. Both arrays must contain 3–5 concise nodes and exactly one hinge; repaired_nodes should contain no misconception unless an important limitation remains. Create exactly one short prediction or counterexample challenge that exposes the misconception before explaining the answer. Be precise, warm, and concise. Never shame the learner. If the explanation is already correct, find its most fragile unstated assumption and label that as the hinge. Keep each field under 55 words. Return only the requested structured data.`;

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-5.6",
        reasoning: { effort: "medium" },
        instructions,
        input: `CONCEPT: ${concept}\n\nLEARNER EXPLANATION:\n${explanation}`,
        text: { format: { type: "json_schema", name: "misconception_mirror", strict: true, schema } },
        store: false,
      }),
    });

    const raw = await openAIResponse.json() as { output_text?: string; error?: { message?: string }; output?: Array<{ content?: Array<{ type?: string; text?: string; refusal?: string }> }> };
    if (!openAIResponse.ok) throw new Error(raw.error?.message || "OpenAI request failed");
    const outputText = raw.output_text || raw.output?.flatMap(item => item.content || []).find(item => item.type === "output_text")?.text;
    const refusal = raw.output?.flatMap(item => item.content || []).find(item => item.type === "refusal")?.refusal;
    if (refusal) return NextResponse.json({ error: refusal }, { status: 422 });
    if (!outputText) throw new Error("The model returned no analysis");
    return NextResponse.json({ ...JSON.parse(outputText), model: "gpt-5.6", mode: "live" });
  } catch (error) {
    if (isDemoExample(concept, explanation)) return NextResponse.json(DEMO_ANALYSIS);
    console.error("Analysis failed", error);
    return NextResponse.json({ error: "The reasoning trace could not be completed. Please try once more." }, { status: 502 });
  }
}
