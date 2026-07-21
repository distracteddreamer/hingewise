# Project Mirror (temporary codename)

> **Find the belief behind the mistake.**

Project Mirror is a diagnostic learning tool that asks a learner to explain an idea in their own words. Instead of generating another lesson or giving away the answer, it uses GPT-5.6 to reconstruct the learner's reasoning, preserve what is correct, locate the earliest mistaken belief, and create one tiny prediction challenge that repairs it.

Built for the **Education** track of [OpenAI Build Week](https://openai.devpost.com/).

## Why this exists

Most AI tutors optimize for answering questions. But a correct answer can leave the learner's underlying mental model untouched. Project Mirror focuses on the moment before explanation: the learner's own causal story. It makes the hidden hinge visible, then uses contrast and prediction to make the correction memorable.

The first polished flow deliberately does one thing:

1. **Listen** — accept a free-form teach-back, not a multiple-choice response.
2. **Trace** — distinguish solid premises, the hidden hinge, and the downstream break.
3. **Flip** — replace only the hidden hinge and reveal how every downstream conclusion realigns.
4. **Repair** — present one counterexample or prediction task before revealing the answer.
5. **Transfer** — ask a fresh question that only the repaired mental model can answer.

## Try it

The deployed experience includes a complete, no-login demo about the cause of seasons. Select **Use example**, then **Analyze my reasoning**. This path remains available if the live API is unavailable so judges can always test the complete product.

For live analysis of any concept, configure `OPENAI_API_KEY` on the server.

## GPT-5.6 implementation

The server route at `app/api/analyze/route.ts` calls the OpenAI Responses API with `model: "gpt-5.6"`. A strict JSON Schema constrains the result into product-native units: diagnosis, detected belief, before-and-after reasoning nodes, repair, challenge, and transfer question. This is not decorative generation—the model's structured causal trace directly creates the interface and learning interaction.

Important reliability choices:

- API credentials never reach the browser.
- Inputs are bounded and validated before inference.
- Responses use strict Structured Outputs rather than best-effort JSON.
- Safety refusals and empty output are handled explicitly.
- Responses are not stored by the OpenAI API (`store: false`).
- The canonical demo is a deterministic fallback if the API is missing or transiently fails.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
cp .env.example .env
# Add an OpenAI API key to .env for live analysis (optional for the demo)
npm run dev
```

Open the local URL shown in the terminal. To verify the production build and integration tests:

```bash
npm test
```

## How Codex and GPT-5.6 were used

This project was created from an empty workspace during Build Week. Codex was the primary collaborator across the entire workflow:

- verified the live competition rules, eligibility, required artifacts, and equal-weight judging rubric;
- compared product directions and selected the misconception-repair wedge for its novelty, real educational value, and three-minute demo clarity;
- scaffolded the full-stack site, designed and implemented the responsive product experience, and built the server integration;
- translated the learning-science product decision into a strict GPT-5.6 output schema and a resilient fallback strategy;
- generated tests, accessibility behavior, documentation, deployment packaging, and the submission narrative;
- iterated through build and runtime failures using the same primary Codex session supplied with the submission.

Key human/product decision: the product intentionally does **not** become a chat tutor. It ends after one misconception, one repair, and one transfer prompt. That constraint is the product.

GPT-5.6 is used at runtime because the task requires nuanced reconstruction of free-form causal reasoning, not keyword matching. Its output is constrained enough to be reliable while leaving the diagnosis itself genuinely model-driven.

## Repository map

- `app/page.tsx` — complete interactive product experience
- `app/api/analyze/route.ts` — validated GPT-5.6 Responses API integration and judge-safe demo
- `app/globals.css` — responsive visual system and accessible interaction states
- `tests/rendered-html.test.mjs` — product shell, input validation, and fallback integration tests
- `submission/` — Devpost copy, demo storyboard, shot list, and final checklist

The local submission workspace also contains a verified 2:05, 1080p narrated demo at `submission/final-video/project-mirror-demo.mp4` plus `captions.srt` for YouTube caption upload. Rendered media is intentionally gitignored to keep the source repository lean.

## Privacy and limitations

Project Mirror does not persist learner explanations. Live text is sent to the OpenAI API solely to generate the reasoning trace. The prototype is a learning aid, not an assessment system; teachers and learners should verify subject-matter claims, especially in high-stakes domains.

## License

MIT. See [LICENSE](LICENSE).
