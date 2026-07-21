# Product decisions and rubric strategy

## Chosen wedge

Project Mirror diagnoses one misconception from a learner's teach-back and repairs it through contrast. The narrowness is deliberate: it creates a complete product loop that can be understood and demonstrated in under three minutes.

## Why Education

The audience and outcome are specific: learners who can state facts but hold an incorrect causal model, and teachers who need to understand *why* an answer is wrong. This is more credible than a general-purpose study assistant and avoids competing on feature count.

## Rubric mapping

### Technological implementation

- Meaningful GPT-5.6 reasoning over free-form explanations
- Responses API with strict JSON Schema
- Model output directly drives inspectable UI state
- Input validation, refusal handling, non-storage, server-side secret, and deterministic fallback
- Production build and integration coverage

### Design

- Complete input → diagnosis → trace → repair → transfer loop
- Responsive editorial interface with concrete sample content
- Progressive disclosure for reasoning details, hints, and answers
- No login, setup, or empty state between a judge and the core moment

### Potential impact

- Targets a real learning failure: correct explanations do not necessarily replace misconceptions
- Specific audience and use case
- Encourages active prediction instead of passive answer consumption
- Natural next step into anonymized class-level misconception patterns

### Quality of the idea

- “Misconception mirror,” not chatbot tutor
- Preserves plausible reasoning and identifies the earliest causal hinge
- Makes the minimum conceptual repair visible as a before/after causal trace
- Uses a single counterexample as the repair mechanism
- Product restraint is visible and defensible

## Ideas intentionally rejected

- General AI tutor: crowded, hard to differentiate, chat-shaped demo
- Study-plan generator: simple but weak runtime necessity for GPT-5.6
- Teacher dashboard: credible impact but too broad for the available time
- Code review/developer tool: strong technical fit but a more crowded track and a slower three-minute reveal
- Multi-agent research workflow: technically impressive but weaker product coherence and reliability in a short build
