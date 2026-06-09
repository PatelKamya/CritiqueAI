import { useState } from "react";
import Slider from "./common/Slider";
import { reviewCode } from "../API";

const categoryMeta = {
  Security: { icon: "verified_user", accent: "#b88bf7" },
  Performance: { icon: "bolt", accent: "#92a8ff" },
  Bug: { icon: "pest_control", accent: "#f19b95" },
  "Best Practice": { icon: "draw", accent: "#98a0ac" },
  Style: { icon: "draw", accent: "#98a0ac" },
  Readability: { icon: "draw", accent: "#98a0ac" },
};

const defaultMeta = { icon: "code", accent: "#98a0ac" };

function severityTone(accent) {
  return `rgba(${hexToRgb(accent)}, 0.12)`;
}

function severityBorder(accent) {
  return `rgba(${hexToRgb(accent)}, 0.5)`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-[#0f1014] px-3.5 py-3 text-sm text-[#ece7df] outline-none transition placeholder:text-white/28 focus:border-[#8ea1ff]/70 focus:bg-[#11131a] focus:ring-2 focus:ring-[#8ea1ff]/15";

const labelClass =
  "mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/42";

export default function ReviewLayout({ onNavigate }) {
  const [language, setLanguage] = useState("javascript");
  const [context, setContext] = useState("");
  const [focus, setFocus] = useState("security");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please paste code before requesting a review.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await reviewCode({ language, context, focus, code });
      setResult(data);
    } catch (err) {
      setError(err.message || "Review failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="h-screen overflow-hidden bg-[#09090d] p-3 text-white sm:p-4"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          backgroundImage:
            "radial-gradient(circle at top, rgba(92,92,255,0.14), transparent 28%), linear-gradient(180deg, #0a0a0e 0%, #08080c 100%)",
        }}
      >
        <div
          className="relative flex h-[calc(100vh-1.5rem)] overflow-hidden rounded-[24px] border border-[#5f55e8] bg-[#0c0d11] shadow-[0_0_0_1px_rgba(125,101,255,0.25),0_30px_80px_rgba(0,0,0,0.55)] sm:h-[calc(100vh-2rem)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at right top, rgba(90,81,225,0.12), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0))",
          }}
        >
          <Slider onNavigate={onNavigate} />

          <div className="custom-scrollbar flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto xl:flex-row">
            <main className="min-w-0 flex-1 border-b border-white/6 px-5 py-5 xl:border-b-0 xl:border-r xl:border-white/6 xl:px-7 xl:py-6">
              <div className="mx-auto max-w-5xl">
                <header className="mb-6">
                  <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.04em] text-[#ece7df] sm:text-[44px]">
                    Instant AI PR Reviews
                  </h1>
                  <p className="mt-2 text-sm text-[#c4b7af]">
                    Paste code, get structured feedback in real time.
                  </p>
                </header>

                <section className="rounded-[18px] border border-white/8 bg-[#141518] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] sm:p-5">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr_0.9fr]">
                      <div>
                        <label htmlFor="review-language" className={labelClass}>
                          Language
                        </label>
                        <select id="review-language" className={fieldClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="csharp">C#</option>
                          <option value="php">PHP</option>
                          <option value="ruby">Ruby</option>
                          <option value="swift">Swift</option>
                          <option value="kotlin">Kotlin</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="review-context" className={labelClass}>
                          Context
                        </label>
                        <input
                          id="review-context"
                          type="text"
                          placeholder="Example: auth middleware, payment flow, UI state"
                          className={fieldClass}
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="review-focus" className={labelClass}>
                          Focus On
                        </label>
                        <select id="review-focus" className={fieldClass} value={focus} onChange={(e) => setFocus(e.target.value)}>
                          <option value="performance">Performance</option>
                          <option value="security">Security</option>
                          <option value="reliability">Reliability</option>
                          <option value="scalability">Scalability</option>
                          <option value="maintainability">Maintainability</option>
                          <option value="usability">Usability</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <label htmlFor="review-code" className={labelClass}>
                          Paste Code
                        </label>
                   
                      </div>
                      <textarea
                        id="review-code"
                        placeholder="Paste your code here..."
                        className={`${fieldClass} custom-scrollbar min-h-[220px] resize-y font-mono text-[13px] leading-6 sm:min-h-[280px]`}
                        spellCheck="false"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/6 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-5 text-white/38">
                        Reviews are structured by severity, category, and suggested fix.
                      </p>
                      <button
                        type="submit"
                        disabled={loading || !code.trim()}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#1477f8] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(20,119,248,0.35)] transition hover:bg-[#2683fa] active:scale-[0.99] disabled:opacity-50 sm:w-auto"
                      >
                        <span className="material-icons mr-2 align-[-4px] text-[16px]">{loading ? "hourglass_top" : "auto_fix_high"}</span>
                        {loading ? "Reviewing..." : "Review Code"}
                      </button>
                    </div>
                  </form>
                </section>

                {error && (
                  <div className="mb-4 mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {result && (
                  <>
                    <div className="mb-2 mt-6 flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#99b5ff]">
                        <span className="h-2 w-2 rounded-full bg-[#9bb1ff]" />
                        AI Review Results
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-[#e7e2dc]">
                        Score: {result.score}/100
                      </div>
                      <div className="text-xs text-white/45">{result.summary}</div>
                    </div>

                    <section className="mt-4 grid gap-4 md:grid-cols-2">
                      {result.issues.map((issue) => {
                        const meta = categoryMeta[issue.category] || defaultMeta;
                        const accent = meta.accent;
                        const tone = severityTone(accent);
                        const border = severityBorder(accent);
                        return (
                          <article
                            key={issue.id}
                            className="rounded-[18px] border bg-[#17181d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                            style={{
                              borderColor: border,
                              boxShadow: `0 0 0 1px ${tone}, inset 0 1px 0 rgba(255,255,255,0.02)`,
                            }}
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em]">
                                <span
                                  className="material-icons text-[15px]"
                                  style={{ color: accent }}
                                >
                                  {meta.icon}
                                </span>
                                <span style={{ color: accent }}>{issue.category}</span>
                              </div>
                              <span
                                className="rounded-full px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em]"
                                style={{ background: tone, color: accent }}
                              >
                                {issue.severity}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-[#e7e2dc]">{issue.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-white/63">{issue.description}</p>

                            {issue.suggestion && (
                              <div className="mt-4 rounded-xl bg-[#0f1014] px-3 py-3 text-[12px] leading-6 text-[#aca8d9]">
                                <pre className="overflow-x-auto whitespace-pre-wrap">
                                  <code>{issue.suggestion}</code>
                                </pre>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </section>

                    {result.positives?.length > 0 && (
                      <section className="mt-6">
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#6fcf97]">
                          <span className="h-2 w-2 rounded-full bg-[#6fcf97]" />
                          Positives
                        </div>
                        <div className="space-y-2">
                          {result.positives.map((p, i) => (
                            <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-white/75">
                              {p}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}

                {loading && !result && (
                  <div className="mb-4 mt-6 flex items-center justify-center gap-2 text-sm text-white/45">
                    <span className="material-icons animate-spin text-[18px]">sync</span>
                    Analyzing your code...
                  </div>
                )}
              </div>
            </main>

            {/* <aside className="w-full shrink-0 px-5 py-5 xl:w-[310px] xl:px-6 xl:py-6">
              <div className="space-y-6">
                <section>
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/28">
                    Usage Analytics
                  </p>
                  <div className="rounded-[18px] border border-white/8 bg-[#17181d] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-white/45">Tokens (Current Session)</p>
                        <p className="mt-1 text-sm font-bold text-white/85">78%</p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/8">
                      <div className="h-full w-[78%] rounded-full bg-[#a5b2ff]" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/6 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                          Cost
                        </p>
                        <p className="mt-2 text-[28px] font-extrabold text-[#ece7df]">$0.42</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                          Reviews
                        </p>
                        <p className="mt-2 text-[28px] font-extrabold text-[#ece7df]">14</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/28">
                      Recent Reviews
                    </p>
                    <span className="material-icons text-[16px] text-white/40">open_in_new</span>
                  </div>
                  <div className="space-y-3">
                    {recentReviews.map((review) => (
                      <div key={review.title} className="flex gap-3">
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{
                            background: review.active ? "#a7b7ff" : "rgba(255,255,255,0.16)",
                          }}
                        />
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: review.active ? "#ece7df" : "rgba(255,255,255,0.55)" }}
                          >
                            {review.title}
                          </p>
                          <p className="mt-1 text-xs text-white/32">{review.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="h-24" />

                <section className="rounded-[18px] border border-[#6f4a42] bg-[#2b2020] p-4">
                  <div className="flex gap-3">
                    <span className="material-icons text-[18px] text-[#ff9f85]">warning_amber</span>
                    <div>
                      <p className="text-sm font-bold text-[#ffb9a8]">Session Limit Warning</p>
                      <p className="mt-1 text-xs leading-5 text-[#d6a79a]">
                        You've reached 85% of your daily API session limit. Review usage in Analytics.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="flex items-center justify-between text-[11px] text-white/28">
                  <span>Copyright 2024 CritiqueAI</span>
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[14px]">bolt</span>
                    <span className="material-icons text-[14px]">mail_outline</span>
                  </div>
                </div>
              </div>
            </aside> */}
          </div>

          <button
            type="button"
            className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#91abff]/45 bg-[#a9c0ff] text-[#2b355f] shadow-[0_18px_40px_rgba(76,118,220,0.35)]"
          >
            <span className="material-icons text-[24px]">forum</span>
          </button>
        </div>
      </div>
    </>
  );
}
