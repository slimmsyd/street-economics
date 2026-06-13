"use client";

/**
 * "The Questionnaire" — community intake form.
 *
 * React port of the S3-Questionnaire design handoff (the `focus` flow: one
 * question per screen, Typeform-style). Surfaces each member's bottleneck and
 * qualifies them DIY-learner vs. done-for-you buyer, then captures email for
 * the solution webinar. On submit it POSTs to /api/questionnaire (Notion);
 * if that's unconfigured it falls back to a client-generated response number.
 *
 * Design tokens, copy, and interactions are final intent — see questionnaire.css.
 */

import { useEffect, useRef, useState } from "react";
import "./questionnaire.css";

type QType = "textarea" | "text" | "email" | "radio" | "multi";

type Question = {
  id: string;
  t: QType;
  label: string;
  req?: boolean;
  note?: string;
  opts?: string[];
  extra?: { label: string; ph: string };
  dep?: string;
  val?: string;
};

type Section = { n: string; title: string; qs: Question[] };

type Answers = Record<string, string | string[]>;

/**
 * The questionnaire runs on two surfaces that differ ONLY in the opening
 * question — everything else (data model, field ids, submit mapping) is shared,
 * so every response lands in the same Notion table.
 *   - "prospect": the main site, for people who haven't joined yet (default here)
 *   - "member":   the standalone questionnaire site, for existing members
 * Both store the answer under the same `why` id → Notion "Why Joined" column.
 * Override per-deploy with NEXT_PUBLIC_QUESTIONNAIRE_AUDIENCE.
 */
type Audience = "prospect" | "member";

const AUDIENCE: Audience =
  (process.env.NEXT_PUBLIC_QUESTIONNAIRE_AUDIENCE as Audience) === "member" ? "member" : "prospect";

const JOIN_QUESTION: Record<Audience, string> = {
  prospect: "ARE YOU INTERESTED IN JOINING THIS COMMUNITY?",
  member: "WHY DID YOU JOIN THIS COMMUNITY?",
};

const DATA: Section[] = [
  {
    n: "01",
    title: "YOU",
    qs: [
      { id: "why", t: "textarea", label: JOIN_QUESTION[AUDIENCE], req: true },
      {
        id: "where",
        t: "radio",
        label: "WHERE ARE YOU RIGHT NOW?",
        opts: ["RUNNING A BUSINESS", "BUILDING ONE RIGHT NOW", "PLANNING TO START", "HERE TO LEARN"],
        extra: { label: "WHAT ARE YOU BUILDING RIGHT NOW? — OPTIONAL", ph: "“IN YOUR OWN WORDS.”" },
      },
    ],
  },
  {
    n: "02",
    title: "YOUR WORLD",
    qs: [
      { id: "building", t: "textarea", label: "WHAT ARE YOU BUILDING OR WORKING ON?" },
      {
        id: "industry",
        t: "radio",
        label: "WHAT INDUSTRY OR SPACE?",
        opts: [
          "E-COMMERCE / RETAIL",
          "CONTENT / MEDIA",
          "AGENCY / SERVICES",
          "TECH / SOFTWARE",
          "REAL ESTATE",
          "FINANCE / TRADING",
          "HEALTH / FITNESS",
          "FOOD & BEVERAGE",
          "OTHER",
        ],
        extra: { label: "NOT LISTED? — TYPE YOUR OWN", ph: "“YOUR INDUSTRY.”" },
      },
      { id: "time", t: "textarea", label: "WHAT'S EATING MOST OF YOUR TIME RIGHT NOW?" },
      {
        id: "bottleneck",
        t: "textarea",
        label: "WHAT'S THE ONE THING YOU WISH YOU COULD HAND OFF OR AUTOMATE?",
        req: true,
        note: "THE BOTTLENECK",
      },
    ],
  },
  {
    n: "03",
    title: "TOOLS",
    qs: [
      { id: "ai", t: "radio", label: "DO YOU USE AI TODAY?", opts: ["YES", "NO"] },
      {
        id: "ai_tools",
        t: "multi",
        label: "WHICH TOOLS?",
        note: "TAP ALL THAT APPLY",
        opts: ["CHATGPT", "CLAUDE", "GEMINI", "MIDJOURNEY", "PERPLEXITY", "COPILOT", "OTHER"],
        dep: "ai",
        val: "YES",
      },
      { id: "ai_use", t: "textarea", label: "WHAT DO YOU USE IT FOR?", dep: "ai", val: "YES" },
      { id: "ai_pay", t: "radio", label: "PAYING OR FREE TIER?", opts: ["PAYING", "FREE TIER"], dep: "ai", val: "YES" },
      { id: "ai_stop", t: "textarea", label: "WHAT'S STOPPED YOU SO FAR?", dep: "ai", val: "NO" },
      { id: "ai_stance", t: "radio", label: "CURIOUS OR SKEPTICAL?", opts: ["CURIOUS", "SKEPTICAL"], dep: "ai", val: "NO" },
      { id: "ai_wish", t: "textarea", label: "ONE THING YOU'D WANT IT TO DO FOR YOU?", dep: "ai", val: "NO" },
    ],
  },
  {
    n: "04",
    title: "CONTENT",
    qs: [
      { id: "content", t: "radio", label: "DO YOU CREATE CONTENT?", opts: ["YES", "NO"] },
      {
        id: "dist",
        t: "multi",
        label: "WHERE DO YOU DISTRIBUTE?",
        note: "TAP ALL THAT APPLY",
        opts: ["INSTAGRAM", "TIKTOK", "YOUTUBE", "X / TWITTER", "LINKEDIN", "NEWSLETTER", "PODCAST", "OTHER"],
        dep: "content",
        val: "YES",
      },
      { id: "hardest", t: "textarea", label: "HARDEST PART OF IT?", dep: "content", val: "YES" },
      { id: "start", t: "radio", label: "WANT TO START?", opts: ["YES", "MAYBE", "NO"], dep: "content", val: "NO" },
    ],
  },
  {
    n: "05",
    title: "BEFORE YOU GO",
    qs: [
      { id: "tried", t: "textarea", label: "WHAT HAVE YOU ALREADY TRIED THAT DIDN'T WORK?" },
      {
        id: "solve",
        t: "radio",
        label: "IF WE SOLVED ONE BOTTLENECK FOR YOU, WOULD YOU RATHER —",
        opts: ["LEARN TO DO IT MYSELF", "HAVE SOMEONE BUILD IT FOR ME", "NOT SURE YET"],
      },
      { id: "email", t: "email", label: "WANT THE RESULTS AND A SEAT AT THE SOLUTION WEBINAR?", note: "LEAVE YOUR EMAIL — OPTIONAL" },
    ],
  },
];

const STORAGE_KEY = "se-questionnaire-answers";

function visibleSections(answers: Answers): Section[] {
  return DATA.map((sec) => ({
    ...sec,
    qs: sec.qs.filter((q) => !q.dep || answers[q.dep] === q.val),
  })).filter((sec) => sec.qs.length > 0);
}

function flat(answers: Answers): { q: Question; sec: Section }[] {
  const out: { q: Question; sec: Section }[] = [];
  visibleSections(answers).forEach((sec) => sec.qs.forEach((q) => out.push({ q, sec })));
  return out;
}

function isEmpty(q: Question, answers: Answers): boolean {
  const v = answers[q.id];
  if (q.t === "multi") return !v || (v as string[]).length === 0;
  return !v || !String(v).trim();
}

export default function Questionnaire() {
  const [phase, setPhase] = useState<"intro" | "form" | "done">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [attempted, setAttempted] = useState(false);
  const [respNo, setRespNo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Latest goNext closure, so the radio auto-advance timeout always fires the
  // current state (avoids stale-closure bugs). Reassigned every render below.
  const goNextRef = useRef<() => void>(() => {});

  // Resilience: rehydrate in-progress answers on load, persist on change,
  // clear after a successful submit (README production note 3).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);
  useEffect(() => {
    try {
      if (Object.keys(answers).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [answers]);

  function setAnswer(id: string, val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    setAttempted(false);
  }

  function pick(q: Question, opt: string) {
    if (q.t === "multi") {
      setAnswers((prev) => {
        const cur = (prev[q.id] as string[]) || [];
        const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
        return { ...prev, [q.id]: next };
      });
      setAttempted(false);
    } else {
      const changed = answers[q.id] !== opt && !q.extra;
      setAnswer(q.id, opt);
      // Auto-advance after a beat — except questions with an extra text field
      // (where, industry), which wait for NEXT.
      if (changed) {
        window.setTimeout(() => goNextRef.current(), 320);
      }
    }
  }

  async function finish(finalAnswers: Answers) {
    setSubmitting(true);
    // Client fallback № (replaced by the server-issued id when available).
    let resolved = "RESPONSE № " + String(Math.floor(1000 + Math.random() * 9000));
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });
      if (res.ok) {
        const j = await res.json();
        if (j && j.respNo) resolved = j.respNo;
      }
    } catch {
      /* offline / endpoint down — keep the client fallback № */
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* non-fatal */
    }
    setRespNo(resolved);
    setPhase("done");
    setSubmitting(false);
    window.scrollTo(0, 0);
  }

  function goNext() {
    if (submitting) return;
    const list = flat(answers);
    const i = Math.min(step, list.length - 1);
    const cur = list[i];
    if (cur && cur.q.req && isEmpty(cur.q, answers)) {
      setAttempted(true);
      return;
    }
    if (i >= list.length - 1) {
      finish(answers);
    } else {
      setStep(i + 1);
      setAttempted(false);
      window.scrollTo(0, 0);
    }
  }
  goNextRef.current = goNext;

  function back() {
    if (step === 0) {
      setPhase("intro");
      setAttempted(false);
    } else {
      setStep((s) => s - 1);
      setAttempted(false);
    }
    window.scrollTo(0, 0);
  }

  function start() {
    setPhase("form");
    setStep(0);
    setAttempted(false);
    window.scrollTo(0, 0);
  }

  function restart() {
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setRespNo("");
    setAttempted(false);
    window.scrollTo(0, 0);
  }

  // ---- Derived render values (focus flow) ----
  const list = flat(answers);
  const total = list.length;
  const idx = Math.min(step, Math.max(total - 1, 0));
  const cur = list[idx];

  const counter =
    total > 0 ? `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : "";
  const headerRight =
    phase === "intro" ? "“QUESTIONNAIRE” — c. 2026" : phase === "done" ? "“COMPLETE”" : counter;

  const progress = total > 0 ? `${Math.round(((idx + 1) / total) * 100)}%` : "0%";
  const nextLabel = idx >= total - 1 ? "SUBMIT →" : "NEXT →";

  let hint = "";
  if (cur) {
    if (attempted) hint = "✱ REQUIRED — ANSWER TO CONTINUE";
    else if (cur.q.t === "radio") hint = "SELECT ONE";
    else if (cur.q.t === "multi") hint = "TAP ALL THAT APPLY";
    else hint = "ENTER ↵ TO CONTINUE";
  }

  const email = String(answers.email || "").trim();
  const doneMeta = respNo + (email ? " — RESULTS TO " + email.toUpperCase() : " — RECORDED");

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      goNext();
    }
  }

  // ---- Single question block ----
  function renderQuestion(q: Question) {
    const raw = answers[q.id];
    const num = `Q.${String(idx + 1).padStart(2, "0")}`;
    const isChoice = q.t === "radio" || q.t === "multi";
    return (
      <div className="qz-q">
        <div className="qz-q-meta">
          <span>{num}</span>
          {q.req && <span className="qz-q-req">✱ REQUIRED</span>}
        </div>
        <h2 className="qz-q-label">{`“${q.label}”`}</h2>
        {q.note && <div className="qz-note">[ {q.note} ]</div>}

        {q.t === "textarea" && (
          <textarea
            className="qz-textarea"
            rows={3}
            autoFocus
            placeholder="“TYPE YOUR ANSWER HERE.”"
            value={(raw as string) || ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            onKeyDown={onKeyDown}
          />
        )}

        {(q.t === "text" || q.t === "email") && (
          <input
            className="qz-input"
            type={q.t === "email" ? "email" : "text"}
            autoFocus
            placeholder={q.t === "email" ? "NAME@DOMAIN.COM" : "“TYPE YOUR ANSWER HERE.”"}
            value={(raw as string) || ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            onKeyDown={onKeyDown}
          />
        )}

        {isChoice && (
          <div className="qz-opts">
            {(q.opts || []).map((o, i) => {
              const sel =
                q.t === "multi" ? Array.isArray(raw) && raw.includes(o) : raw === o;
              const prefix = q.t === "multi" ? (sel ? "■" : "□") : `( ${String.fromCharCode(65 + i)} )`;
              return (
                <button
                  key={o}
                  type="button"
                  className="qz-opt"
                  onClick={() => pick(q, o)}
                  style={{
                    background: sel ? "var(--qz-blue)" : "transparent",
                    color: sel ? "var(--qz-canvas)" : "var(--qz-blue)",
                  }}
                  onMouseEnter={(e) => {
                    if (!sel) e.currentTarget.style.background = "var(--qz-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!sel) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span className="qz-opt__left">
                    <span className="qz-opt__prefix">{prefix}</span>
                    <span>{o}</span>
                  </span>
                  <span className="qz-opt__mark">{sel ? "✕" : ""}</span>
                </button>
              );
            })}
          </div>
        )}

        {q.extra && (
          <div className="qz-extra">
            <div className="qz-note">[ {q.extra.label} ]</div>
            <input
              className="qz-input"
              type="text"
              placeholder={q.extra.ph}
              value={(answers[q.id + "_extra"] as string) || ""}
              onChange={(e) => setAnswer(q.id + "_extra", e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="qz">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="qz-bg" src="/uploads/CHASEBG.webp" alt="" />
      <div className="qz-veil" style={{ opacity: phase === "intro" ? 0 : 0.91 }} />

      <header className="qz-header">
        <div>STREETECONOMICS®</div>
        <div>{headerRight}</div>
      </header>

      {phase === "intro" && (
        <main className="qz-main qz-intro">
          <span className="qz-corner qz-corner--l">✕</span>
          <span className="qz-corner qz-corner--r">✕</span>
          <div className="qz-intro-row">
            <div style={{ maxWidth: 780 }}>
              <div className="qz-eyebrow">SECTION 00 — “INTRODUCTION”</div>
              <h1 className="qz-display">“THE QUESTIONNAIRE”</h1>
              <p className="qz-meta">APPROX. 13 QUESTIONS — 4 MIN — c. 2026</p>
            </div>
            <button type="button" className="qz-btn" onClick={start}>
              START <span>→</span>
            </button>
          </div>
          <div className="qz-rule">
            <span>FOR COMMUNITY PURPOSES ONLY™</span>
            <span>N.Y.C. — EVERYWHERE</span>
          </div>
        </main>
      )}

      {phase === "form" && cur && (
        <>
          <main className="qz-main qz-form">
            <div className="qz-sections">
              <section className="qz-section">
                <div className="qz-section-head">
                  <span>SECTION {cur.sec.n}</span>
                  <span>“{cur.sec.title}”</span>
                </div>
                <div className="qz-questions">{renderQuestion(cur.q)}</div>
              </section>
            </div>
          </main>

          <footer className="qz-footer">
            <div className="qz-track">
              <div className="qz-fill" style={{ width: progress }} />
            </div>
            <div className="qz-controls">
              <button type="button" className="qz-btn qz-btn--ghost qz-btn--back" onClick={back}>
                ← BACK
              </button>
              <span className="qz-hint">{hint}</span>
              <button type="button" className="qz-btn qz-btn--sm" onClick={goNext} disabled={submitting}>
                {submitting ? "SENDING…" : nextLabel}
              </button>
            </div>
          </footer>
        </>
      )}

      {phase === "done" && (
        <main className="qz-main qz-done">
          <div className="qz-done-meta">{doneMeta}</div>
          <h1 className="qz-display">“THANK YOU.”</h1>
          <p className="qz-done-body">
            YOUR ANSWERS WILL SHAPE WHAT GETS BUILT NEXT. SEAT DETAILS FOR THE SOLUTION WEBINAR TO FOLLOW.
          </p>
          <div className="qz-done-actions">
            <button type="button" className="qz-btn qz-btn--ghost qz-btn--sm" onClick={restart}>
              SUBMIT ANOTHER →
            </button>
          </div>
          <div className="qz-rule">
            <span>FOR COMMUNITY PURPOSES ONLY™</span>
            <span>c. 2026</span>
          </div>
        </main>
      )}
    </div>
  );
}
