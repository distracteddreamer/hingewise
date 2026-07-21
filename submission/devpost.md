# Devpost submission copy

## Temporary project title

Project Mirror

## Tagline

Find the belief behind the mistake.

## Track

Education

## Short description

Project Mirror turns a learner's confident explanation into a visual reasoning trace. GPT-5.6 preserves the parts they understand, pinpoints the earliest mistaken belief, and creates one tiny prediction challenge that makes the correction stick.

## Inspiration

AI tutors are excellent at producing answers and explanations. That is also their blind spot: a learner can read a flawless answer while keeping the same flawed mental model.

The most revealing moment in learning is often the sentence, “I think it works like this…” A teach-back exposes not only what a learner knows, but the causal story connecting those facts. We wanted to build for that moment.

## What it does

Project Mirror asks a learner to explain any concept in their own words. It then:

- reconstructs the explanation as a causal reasoning trace;
- distinguishes solid premises from the hidden hinge where the reasoning turns;
- lets the learner flip that hinge and watch the downstream reasoning chain realign;
- names the precise belief to replace and explains why it felt plausible;
- offers a better mental model without overwhelming the learner;
- generates one prediction or counterexample challenge before revealing the answer; and
- asks a transfer question to check whether the repaired model generalizes.

The default seasons example makes the complete experience testable without sign-in. A deterministic fallback keeps that demo working even during a transient API failure.

## How we built it

Project Mirror is a responsive full-stack React/Next experience compiled with vinext for Cloudflare Workers. The analysis route calls the OpenAI Responses API with GPT-5.6 and uses strict Structured Outputs to produce a product-native schema: diagnosis, belief, original reasoning nodes, minimally repaired nodes, micro-challenge, and transfer question.

The architecture intentionally avoids a conversational loop. The model does one bounded diagnostic pass, the interface makes that reasoning inspectable, and the learner performs one targeted repair. Input limits, server-only credentials, explicit refusal handling, `store: false`, and a judge-safe fallback keep the experience reliable.

## How we used Codex and GPT-5.6

Codex was the primary collaborator from an empty workspace through a tested deployment. In one core session it:

- verified the live competition rules and equal-weight rubric;
- evaluated product directions against novelty, impact, technical depth, and three-minute demo clarity;
- scaffolded and implemented the full-stack experience and visual system;
- translated the product hypothesis into a strict GPT-5.6 schema;
- diagnosed setup, build, interaction, and responsive-layout issues;
- wrote integration tests, documentation, submission copy, and the demo storyboard; and
- prepared the deployable source and judge-safe testing path.

GPT-5.6 is the runtime reasoning engine. Its role is essential: free-form explanations contain correct premises, implicit assumptions, and plausible causal leaps that cannot be diagnosed with keyword matching. Structured Outputs let the model's diagnosis drive a reliable, coherent interface instead of appearing as a generic chat response.

## Challenges we ran into

The central challenge was product restraint. It was tempting to add chat, courses, scoring, accounts, and dashboards. We chose the harder design constraint: one misconception, one repair, one transfer check.

Reliability was the second challenge. A live AI demo can fail for reasons unrelated to product quality, so we paired a genuine GPT-5.6 integration for arbitrary concepts with a deterministic canonical example. The same structured contract powers both paths, allowing judges to always experience the product as demonstrated.

## Accomplishments we're proud of

- The product feels like a finished learning interaction, not a prompt wrapper.
- The before/after reasoning trace preserves what the learner got right and changes only the causal hinge.
- The repair is active: learners must predict before seeing the explanation.
- The entire core loop is understandable in under one minute.
- The deployed demo requires no account and remains functional without a secret.
- Server rendering, validation behavior, and fallback integration are covered by automated tests.

## What we learned

The best use of a frontier model is sometimes not broader agency, but sharper constraint. GPT-5.6 becomes more valuable here because it is asked to make one high-leverage judgment—where a learner's causal model first diverges—inside a strict, testable output contract.

We also learned that educational feedback is more useful when it separates “reasonable” from “correct.” Naming why a misconception felt plausible makes the correction less adversarial and more memorable.

## What's next

The next version would let teachers compare anonymized misconception patterns across a class without grading individuals, and would evaluate repair quality through repeated transfer questions. Subject-specific evaluation sets would measure whether the identified hinge agrees with expert annotations.

## Testing instructions for judges

1. Open the deployed URL; no login is required.
2. Keep the prefilled seasons explanation or click **Use example**.
3. Click **Analyze my reasoning**.
4. Expand a reasoning node, reveal the hint, then reveal the repair.
5. For live GPT-5.6 analysis, replace the concept and explanation with any other topic.

Expected default-demo result: the trace identifies “Earth moves much closer during summer” as the hidden hinge and uses opposite seasons in Canada and Argentina as the one-minute counterexample.

## Technologies

Codex, GPT-5.6, OpenAI Responses API, Structured Outputs, React 19, Next.js 16, TypeScript, vinext, Cloudflare Workers, CSS.
