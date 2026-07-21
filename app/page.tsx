"use client";

import { FormEvent, useMemo, useState } from "react";

type ReasoningNode = {
  id: string;
  label: string;
  detail: string;
  kind: "sound" | "hinge" | "misconception";
};

type Analysis = {
  concept: string;
  diagnosis: string;
  detected_belief: string;
  why_it_feels_true: string;
  repair: string;
  nodes: ReasoningNode[];
  repaired_nodes: ReasoningNode[];
  challenge: {
    prompt: string;
    hint: string;
    answer: string;
  };
  transfer_question: string;
  model: string;
  mode: "live" | "demo";
};

const EXAMPLES = [
  {
    id: "seasons",
    label: "Seasons",
    concept: "The seasons",
    explanation:
      "Summer happens because Earth moves closer to the Sun, so it gets hotter. In winter Earth is farther away, so it gets colder.",
  },
  {
    id: "compound-interest",
    label: "Compound interest",
    concept: "Compound interest",
    explanation:
      "Compound interest means the bank adds the same fixed amount of interest every year, so the balance grows in a straight line over time.",
  },
  {
    id: "recursion",
    label: "Recursion",
    concept: "Recursion in programming",
    explanation:
      "A recursive function keeps calling itself until the computer notices the answer is complete, then it automatically knows when to stop.",
  },
  {
    id: "natural-selection",
    label: "Natural selection",
    concept: "Natural selection",
    explanation:
      "Animals adapt during their lifetime because they need a trait, then their offspring inherit the improvement that the parent developed.",
  },
] as const;

const DEFAULT_EXAMPLE = EXAMPLES[0];

const steps = ["Listen", "Trace", "Repair"];

export default function Home() {
  const [concept, setConcept] = useState(DEFAULT_EXAMPLE.concept);
  const [explanation, setExplanation] = useState(DEFAULT_EXAMPLE.explanation);
  const [attempts, setAttempts] = useState<Analysis[]>([]);
  const [activeAttempt, setActiveAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openNode, setOpenNode] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [traceMode, setTraceMode] = useState<"before" | "after">("before");
  const [markerStyle, setMarkerStyle] = useState<"classic" | "shapes" | "letters">("classic");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpError, setFollowUpError] = useState("");

  const characterCount = explanation.length;
  const canAnalyze = concept.trim().length > 1 && explanation.trim().length > 20;
  const analysis = attempts[activeAttempt] ?? null;

  const progressLabel = useMemo(() => {
    if (!loading) return "Analyze my reasoning";
    return "Tracing your reasoning…";
  }, [loading]);

  async function requestAnalysis(nextConcept: string, nextExplanation: string, isFollowUp = false) {
    if (nextConcept.trim().length < 2 || nextExplanation.trim().length < 20 || loading) return;
    setLoading(true);
    setError("");
    setFollowUpError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ concept: nextConcept, explanation: nextExplanation }),
      });
      const payload = (await response.json()) as Analysis & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Analysis failed");
      const nextAttempt = attempts.length;
      setAttempts([...attempts, payload]);
      setActiveAttempt(nextAttempt);
      setOpenNode(null);
      setShowHint(false);
      setShowAnswer(false);
      setTraceMode("before");
      setShowFollowUp(false);
      setFollowUpAnswer("");
      window.setTimeout(() => {
        document.getElementById("mirror")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Something went wrong. Please try again.";
      if (isFollowUp) setFollowUpError(message);
      else setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function analyze(event: FormEvent) {
    event.preventDefault();
    if (!canAnalyze) return;
    await requestAnalysis(concept, explanation);
  }

  async function analyzeFollowUp(event: FormEvent) {
    event.preventDefault();
    if (!analysis || followUpAnswer.trim().length < 20) return;
    await requestAnalysis(
      analysis.concept,
      `Transfer question: ${analysis.transfer_question}\n\nMy explanation: ${followUpAnswer}`,
      true,
    );
  }

  function loadExample(id: string) {
    const example = EXAMPLES.find((item) => item.id === id);
    if (!example) return;
    setConcept(example.concept);
    setExplanation(example.explanation);
    setError("");
    setFollowUpError("");
  }

  function markerFor(kind: ReasoningNode["kind"]) {
    if (markerStyle === "classic") {
      return kind === "sound" ? "✓" : kind === "hinge" ? "?" : "×";
    }
    if (markerStyle === "letters") {
      return kind === "sound" ? "S" : kind === "hinge" ? "H" : "R";
    }
    return kind === "sound" ? "●" : kind === "hinge" ? "◆" : "○";
  }

  function showAttempt(index: number) {
    setActiveAttempt(index);
    setOpenNode(null);
    setShowHint(false);
    setShowAnswer(false);
    setTraceMode("before");
    setShowFollowUp(false);
    setFollowUpAnswer("");
    setFollowUpError("");
  }

  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Project Mirror home">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Project Mirror</span>
          <span className="beta">beta</span>
        </a>
        <div className="nav-right">
          <span className="privacy"><i /> Your words aren&apos;t stored</span>
          <a className="nav-link" href="#why">Why it works</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><span>✦</span> A different kind of tutor</div>
        <h1>Don&apos;t show me the answer.<br /><em>Show me where I went wrong.</em></h1>
        <p className="hero-copy">
          Explain an idea in your own words. Mirror traces your reasoning, finds the one belief holding you back,
          and gives you a tiny challenge that makes the correction stick.
        </p>

        <form className="input-card" onSubmit={analyze}>
          <div className="card-topline">
            <span className="step-number">01</span>
            <div>
              <h2>Teach it back</h2>
              <p>Messy thinking welcome. Confidence is useful signal.</p>
            </div>
            <label className="example-picker">
              <span>Try an example</span>
              <select defaultValue="" onChange={(event) => { loadExample(event.target.value); event.target.value = ""; }}>
                <option value="" disabled>Choose a topic</option>
                {EXAMPLES.map((example) => <option key={example.id} value={example.id}>{example.label}</option>)}
              </select>
            </label>
          </div>

          <label className="field-label" htmlFor="concept">What are you learning?</label>
          <input
            id="concept"
            className="concept-input"
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="e.g. photosynthesis, recursion, compound interest"
            maxLength={100}
          />

          <label className="field-label explanation-label" htmlFor="explanation">
            Explain it like you&apos;re teaching a friend
          </label>
          <div className="textarea-wrap">
            <textarea
              id="explanation"
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              placeholder="I think it works like this…"
              maxLength={1200}
            />
            <span className="count">{characterCount}/1200</span>
          </div>

          <div className="form-footer">
            <p><span aria-hidden="true">↳</span> The more certain you sound, the sharper the diagnosis.</p>
            <button className="primary-button" disabled={!canAnalyze || loading} type="submit">
              {loading && <span className="spinner" aria-hidden="true" />}
              {progressLabel}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
      </section>

      {analysis && (
        <section className="results shell" id="mirror" aria-live="polite">
          <div className="result-heading">
            <div>
              <div className="eyebrow"><span>✦</span> Your misconception mirror</div>
              <h2>One wrong turn.<br /><em>Now visible.</em></h2>
            </div>
            <div className="result-meta">
              <div className="model-pill"><i /> {analysis.mode === "live" ? "Live" : "Resilient demo"} · {analysis.model}</div>
              {attempts.length > 1 && (
                <div className="history-stepper" aria-label="Session analysis history">
                  <button
                    type="button"
                    disabled={activeAttempt === 0}
                    onClick={() => showAttempt(Math.max(0, activeAttempt - 1))}
                    aria-label="Show earlier analysis"
                  >← <span>Earlier</span></button>
                  <div aria-live="polite">
                    <strong>Attempt {activeAttempt + 1} of {attempts.length}</strong>
                    <span>{analysis.concept}</span>
                  </div>
                  <button
                    type="button"
                    disabled={activeAttempt === attempts.length - 1}
                    onClick={() => showAttempt(Math.min(attempts.length - 1, activeAttempt + 1))}
                    aria-label="Show later analysis"
                  ><span>Later</span> →</button>
                </div>
              )}
            </div>
          </div>

          <div className="diagnosis-card">
            <span className="quote-mark">“</span>
            <p>{analysis.diagnosis}</p>
            <span className="diagnosis-label">The hinge in your reasoning</span>
          </div>

          <div className="trace-layout">
            <div className="trace-panel">
              <div className="trace-panel-top">
                <div>
                  <div className="panel-kicker">Reasoning trace</div>
                  <h3>{traceMode === "before" ? "How your explanation unfolds" : "What changes when the hinge flips"}</h3>
                </div>
                <div className="trace-controls">
                  <div className="marker-toggle" aria-label="Reasoning marker style">
                    <span>Markers</span>
                    <button type="button" className={markerStyle === "classic" ? "active" : ""} onClick={() => setMarkerStyle("classic")} aria-pressed={markerStyle === "classic"}>Classic</button>
                    <button type="button" className={markerStyle === "shapes" ? "active" : ""} onClick={() => setMarkerStyle("shapes")} aria-pressed={markerStyle === "shapes"}>Shapes</button>
                    <button type="button" className={markerStyle === "letters" ? "active" : ""} onClick={() => setMarkerStyle("letters")} aria-pressed={markerStyle === "letters"}>Letters</button>
                  </div>
                  <div className="trace-toggle" aria-label="Reasoning trace view">
                    <button type="button" className={traceMode === "before" ? "active" : ""} onClick={() => setTraceMode("before")}>Before</button>
                    <button type="button" className={traceMode === "after" ? "active" : ""} onClick={() => setTraceMode("after")}>After</button>
                  </div>
                </div>
              </div>
              <div className={`hinge-flip ${traceMode === "after" ? "flipped" : ""}`}>
                <span aria-hidden="true">↻</span>
                <p>{traceMode === "before" ? "One assumption bends everything after it." : "Replace the hinge; the downstream logic realigns."}</p>
              </div>
              <div className="trace" role="list">
                {(traceMode === "before" ? analysis.nodes : analysis.repaired_nodes).map((node, index, displayedNodes) => (
                  <div className={`trace-row ${node.kind}`} role="listitem" key={node.id}>
                    <div className="trace-rail" aria-hidden="true">
                      <span className="trace-dot">{markerFor(node.kind)}</span>
                      {index < displayedNodes.length - 1 && <span className="trace-line" />}
                    </div>
                    <button
                      className="trace-node"
                      type="button"
                      aria-expanded={openNode === node.id}
                      onClick={() => setOpenNode(openNode === node.id ? null : node.id)}
                    >
                      <span className="node-kind">{node.kind === "sound" ? "Solid footing" : node.kind === "hinge" ? (traceMode === "before" ? "The hidden hinge" : "Hinge replaced") : "Where it breaks"}</span>
                      <strong>{node.label}</strong>
                      <span className={`node-detail ${openNode === node.id ? "open" : ""}`}>{node.detail}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <aside className="belief-panel">
              <div className="belief-icon" aria-hidden="true">↯</div>
              <div className="panel-kicker coral">Belief to replace</div>
              <h3>{analysis.detected_belief}</h3>
              <div className="belief-section">
                <span>Why it feels true</span>
                <p>{analysis.why_it_feels_true}</p>
              </div>
              <div className="belief-section repair">
                <span>Better mental model</span>
                <p>{analysis.repair}</p>
              </div>
            </aside>
          </div>

          <div className="challenge-card">
            <div className="challenge-number">02</div>
            <div className="challenge-main">
              <div className="panel-kicker">One-minute repair</div>
              <h3>{analysis.challenge.prompt}</h3>
              <p>Don&apos;t calculate yet. Predict first, then explain what your prediction tests.</p>
              <div className="challenge-actions">
                <button type="button" className="secondary-button" onClick={() => setShowHint(!showHint)}>
                  {showHint ? "Hide hint" : "Give me a hint"}
                </button>
                <button type="button" className="text-button" onClick={() => setShowAnswer(!showAnswer)}>
                  {showAnswer ? "Hide answer" : "Check the repair"} <span>→</span>
                </button>
              </div>
              {showHint && <div className="reveal"><strong>Hint:</strong> {analysis.challenge.hint}</div>}
              {showAnswer && <div className="reveal answer"><strong>Answer:</strong> {analysis.challenge.answer}</div>}
            </div>
          </div>

          <div className="transfer-strip">
            <span>Ready to prove it transferred?</span>
            <strong>{analysis.transfer_question}</strong>
            <button type="button" aria-expanded={showFollowUp} aria-controls="follow-up" onClick={() => { setShowFollowUp(!showFollowUp); setFollowUpError(""); }}>
              {showFollowUp ? "Close response" : "Explain again"} <span>{showFollowUp ? "↓" : "↗"}</span>
            </button>
          </div>

          {showFollowUp && (
            <form className="follow-up-card" id="follow-up" onSubmit={analyzeFollowUp}>
              <div>
                <div className="panel-kicker">Transfer question</div>
                <h3>Explain the transfer in your own words</h3>
              </div>
              <div className="follow-up-compose">
                <textarea
                  aria-label="Your transfer explanation"
                  value={followUpAnswer}
                  onChange={(event) => setFollowUpAnswer(event.target.value)}
                  placeholder="I think the repaired model predicts…"
                  maxLength={800}
                  autoFocus
                />
                <div className="follow-up-footer">
                  <span>{followUpAnswer.length}/800</span>
                  <button className="primary-button" disabled={followUpAnswer.trim().length < 20 || loading} type="submit">
                    {loading && <span className="spinner" aria-hidden="true" />}
                    {loading ? "Checking your reasoning…" : "Analyze this explanation"}
                    {!loading && <span aria-hidden="true">→</span>}
                  </button>
                </div>
                {followUpError && <p className="error" role="alert">{followUpError}</p>}
              </div>
            </form>
          )}
        </section>
      )}

      <section className="why shell" id="why">
        <div className="why-heading">
          <div className="eyebrow"><span>✦</span> Built for the moment learning changes</div>
          <h2>Answers finish a task.<br /><em>Contrast changes a mind.</em></h2>
        </div>
        <div className="why-grid">
          {[
            ["01", "Your words, not a quiz", "A confident explanation reveals the learner's actual mental model—not just whether they guessed correctly."],
            ["02", "One hinge, not ten tips", "The model isolates the earliest belief that causes later errors, keeping feedback specific and actionable."],
            ["03", "Repair through prediction", "A tiny counterexample creates productive surprise, then checks whether the new model transfers."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer shell">
        <div className="brand"><span className="brand-mark">M</span><span>Project Mirror</span></div>
        <p>Built with Codex + GPT‑5.6 for OpenAI Build Week.</p>
        <div className="footer-steps">{steps.map((step, index) => <span key={step}>{index + 1}. {step}</span>)}</div>
      </footer>
    </main>
  );
}
