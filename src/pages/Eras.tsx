import { useState } from "react";
import { useNavigate } from "react-router";
import { ERAS } from "../data";

const BG     = "#faf7f2";
const WHITE  = "#ffffff";
const FG     = "#1a1612";
const FG2    = "#3d3428";
const MUTED  = "#7a6e5e";
const BORDER = "#e0d8cc";
const AMBER  = "#b07820";

export default function Eras() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const era = ERAS[active];

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: BG, color: FG, display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "48px 32px 0" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: AMBER, marginBottom: 8, transition: "color 0.4s" }}>Literary Timeline · 5 Eras · ~2,300 Years</p>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: FG, lineHeight: 1.1, marginBottom: 12 }}>Era Journey</h1>
        <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1rem", color: FG2, maxWidth: 520, marginBottom: 40 }}>
          Travel through Tamil literary history. Each era shaped the language differently — select a period to explore.
        </p>
      </div>

      {/* Timeline rail */}
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "0 32px" }}>
        <div style={{ position: "relative", marginBottom: 48 }}>
          <div style={{ position: "absolute", top: 20, left: 20, right: 20, height: 2, background: BORDER }} />
          <div style={{ position: "absolute", top: 20, left: 20, height: 2, width: `${(active / (ERAS.length - 1)) * 88}%`, background: era.color, transition: "width 0.4s ease, background 0.4s ease" }} />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {ERAS.map((e, i) => (
              <div key={e.id} onClick={() => setActive(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, cursor: "pointer", flex: 1 }}>
                <div style={{ width: i === active ? 20 : 12, height: i === active ? 20 : 12, borderRadius: "50%", background: i <= active ? e.color : BORDER, border: `2px solid ${i === active ? e.color : BORDER}`, boxShadow: i === active ? `0 0 0 4px ${e.color}30` : "none", transition: "all 0.3s ease", zIndex: 1 }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Lora', serif", fontSize: "0.88rem", fontWeight: i === active ? 700 : 400, color: i === active ? e.color : MUTED, transition: "color 0.3s" }}>{e.name}</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: MUTED, marginTop: 2 }}>{e.period.split("–")[0].trim()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Era detail */}
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "0 32px 64px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Left panel */}
          <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ height: 4, background: era.color, transition: "background 0.4s" }} />
            <div style={{ padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6 }}>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: "2.2rem", fontWeight: 700, color: FG }}>{era.name}</h2>
                <span style={{ fontFamily: "'Lora', serif", fontSize: "1.2rem", color: era.color, transition: "color 0.4s" }}>{era.tamil}</span>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: era.color, letterSpacing: "0.1em", marginBottom: 20, transition: "color 0.4s" }}>{era.period}</p>
              <p style={{ fontFamily: "'Source Sans 3'", fontSize: "0.95rem", color: FG2, lineHeight: 1.8, marginBottom: 28 }}>{era.description}</p>

              <div style={{ display: "flex", gap: 28, padding: "16px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, marginBottom: 28 }}>
                {[
                  { label: "Total words",   value: era.wordCount.toLocaleString() },
                  { label: "Unique lemmas", value: era.uniqueWords.toLocaleString() },
                  { label: "Texts indexed", value: era.texts.length.toString() },
                ].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.15rem", color: era.color, fontWeight: 500, transition: "color 0.4s" }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Indexed texts</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {era.texts.map((t) => (
                    <span key={t} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", color: FG2, background: BG, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "4px 10px" }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {active > 0 && (
                  <button onClick={() => setActive(active - 1)} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 16px", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 4, color: MUTED, cursor: "pointer" }}>← Previous era</button>
                )}
                {active < ERAS.length - 1 && (
                  <button onClick={() => setActive(active + 1)} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 16px", background: era.color, border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", fontWeight: 700, transition: "background 0.3s" }}>Next era →</button>
                )}
              </div>
            </div>
          </div>

          {/* Right panels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Verse */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "28px", flex: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Defining verse</p>
              <blockquote style={{ margin: 0, borderLeft: `3px solid ${era.color}`, paddingLeft: 20, transition: "border-color 0.4s" }}>
                <p style={{ fontFamily: "'Lora', serif", fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", lineHeight: 1.9, color: FG, fontStyle: "italic", marginBottom: 14 }}>{era.highlight}</p>
                <cite style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", color: MUTED, fontStyle: "normal" }}>— {era.highlightSource}</cite>
              </blockquote>
            </div>

            {/* Corpus size bars */}
            <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Corpus size across eras</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ERAS.map((e, i) => (
                  <div key={e.id} onClick={() => setActive(i)} style={{ cursor: "pointer", opacity: i === active ? 1 : 0.55, transition: "opacity 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", color: i === active ? e.color : FG2, fontWeight: i === active ? 600 : 400 }}>{e.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: MUTED }}>{e.wordCount.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 5, background: "#ede6da", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${(e.wordCount / 88400) * 100}%`, background: e.color, borderRadius: 3, transition: "width 0.4s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/texts")}
              style={{ fontFamily: "'Source Sans 3'", fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, padding: "14px", background: "transparent", border: `1.5px solid ${era.color}`, borderRadius: 4, color: era.color, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { const b = e.target as HTMLButtonElement; b.style.background = era.color; b.style.color = "#fff"; }}
              onMouseLeave={(e) => { const b = e.target as HTMLButtonElement; b.style.background = "transparent"; b.style.color = era.color; }}
            >
              Read {era.name} texts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
