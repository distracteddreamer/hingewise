# Devpost submission copy

## Temporary project title

Hingewise

## Tagline

Find the belief behind the mistake.

## Track

Education

## Short description

Hingewise turns a learner's confident explanation into a visual reasoning trace. GPT-5.6 preserves the parts they understand, pinpoints the earliest mistaken belief, and creates one tiny prediction challenge that makes the correction stick.

## Inspiration

AI tutors are excellent at producing answers and explanations. That is also their blind spot: a learner can read a flawless answer while keeping the same flawed mental model.

The most revealing moment in learning is often the sentence, “I think it works like this…” A teach-back exposes not only what a learner knows, but the causal story connecting those facts. I wanted to build for that moment.

## What it does

Hingewise asks a learner to explain any concept in their own words. It then:

- reconstructs the explanation as a causal reasoning trace;
- distinguishes solid premises from the hidden hinge where the reasoning turns;
- lets the learner flip that hinge and watch the downstream reasoning chain realign;
- names the precise belief to replace and explains why it felt plausible;
- offers a better mental model without overwhelming the learner;
- generates one prediction or counterexample challenge before revealing the answer;
- asks a transfer question to check whether the repaired model generalizes; and
- keeps a compact session trail so learners can revisit earlier reasoning without cluttering the page.

The experience requires no sign-in, and learners can submit their own concept and explanation immediately.

## How I built it

Hingewise is a responsive full-stack React/Next experience compiled with vinext for Cloudflare Workers. The analysis route calls the OpenAI Responses API with GPT-5.6 and uses strict Structured Outputs to produce a product-native schema: diagnosis, belief, original reasoning nodes, minimally repaired nodes, micro-challenge, and transfer question.

The architecture intentionally avoids a conversational loop. The model does one bounded diagnostic pass, the interface makes that reasoning inspectable, and the learner performs one targeted repair. Input limits, server-only credentials, explicit refusal handling, and `store: false` keep the experience reliable.

## How I used Codex and GPT-5.6

Codex was the primary collaborator from an empty workspace through a tested deployment. In one core session it:

- verified the live competition rules and equal-weight rubric;
- evaluated product directions against novelty, impact, technical depth, and three-minute demo clarity;
- scaffolded and implemented the full-stack experience and visual system;
- translated the product hypothesis into a strict GPT-5.6 schema;
- diagnosed setup, build, interaction, and responsive-layout issues;
- wrote integration tests, documentation, submission copy, and the demo storyboard; and
- prepared the deployable source and reliable testing path.

GPT-5.6 is the runtime reasoning engine. Its role is essential: free-form explanations contain correct premises, implicit assumptions, and plausible causal leaps that cannot be diagnosed with keyword matching. Structured Outputs let the model's diagnosis drive a reliable, coherent interface instead of appearing as a generic chat response.

My role was to test the product repeatedly and propose changes based on how the learning experience would feel over successive use. That feedback shaped the persistent session trail, focused repair flow, and final interaction polish.

## Challenges I ran into

The central challenge was product restraint. It was tempting to add chat, courses, scoring, accounts, and dashboards. I kept the experience centred on one misconception, one repair, and one transfer check.

Reliability was the second challenge. Strict Structured Outputs, bounded inputs, explicit error handling, and automated integration tests make the live GPT-5.6 interaction predictable enough to become a polished product experience.

## Accomplishments I'm proud of

- The product feels like a finished learning interaction, not a prompt wrapper.
- The before/after reasoning trace preserves what the learner got right and changes only the causal hinge.
- The repair is active: learners must predict before seeing the explanation.
- The entire core loop is understandable in under one minute.
- The deployed experience requires no account.
- Server rendering, validation behaviour, and the analysis integration are covered by automated tests.

## What I learned

The best use of a frontier model is sometimes not broader agency, but sharper constraint. GPT-5.6 becomes more valuable here because it is asked to make one high-leverage judgment—where a learner's causal model first diverges—inside a strict, testable output contract.

I also learned that educational feedback is more useful when it separates “reasonable” from “correct.” Naming why a misconception felt plausible makes the correction less adversarial and more memorable.

## What's next

The next version would let teachers compare anonymized misconception patterns across a class without grading individuals, and would evaluate repair quality through repeated transfer questions. Subject-specific evaluation sets would measure whether the identified hinge agrees with expert annotations.

## Testing instructions for judges

1. Open the deployed URL; no login is required.
2. Enter any concept in **What are you learning?**.
3. In **Teach it back**, explain how you think it works. A confident explanation that may contain a mistaken assumption produces the clearest demonstration.
4. Click **Analyze my reasoning**.
5. Review the reasoning trace, use **Explain again** to revise the explanation, and complete the prediction challenge and transfer check.

For a quick example, try:

- **What are you learning?** `Why metal feels colder than wood`
- **Teach it back:** `Metal objects are naturally colder than wooden ones because metal stores more cold, even when both have been in the same room all day.`

For this example, Hingewise should preserve the observation that metal feels colder while challenging the belief that it stores more cold, then connect the sensation to faster heat transfer from the hand.

## Technologies

Codex, GPT-5.6, OpenAI Responses API, Structured Outputs, React 19, Next.js 16, TypeScript, vinext, Cloudflare Workers, CSS.
