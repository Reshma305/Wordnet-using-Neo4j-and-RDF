import { useState } from "react";
import { useNavigate } from "react-router";
import { ERAS, VERSE_EXAMPLES } from "../data";

const BG     = "#faf7f2";
const WHITE  = "#ffffff";
const AMBER  = "#b07820";
const FG     = "#1a1612";
const FG2    = "#3d3428";
const MUTED  = "#7a6e5e";
const BORDER = "#e0d8cc";

export default function Texts() {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = activeEra ? VERSE_EXAMPLES.filter((v) => v.era === activeEra) : VERSE_EXAMPLES;

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: BG, color: FG }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 64px" }}>

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: AMBER, marginBottom: 8 }}>Corpus · 14 Texts Indexed</p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: FG, lineHeight: 1.1, marginBottom: 12 }}>Text Explorer</h1>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1rem", color: FG2, maxWidth: 540 }}>
            Read excerpts from across Tamil literary history. Click any highlighted word to explore its full corpus footprint.
          </p>
        </div>

        {/* Era filter */}
        <div style={{ display: "flex", gap: 1, background: BORDER, borderRadius: 4, overflow: "hidden", marginBottom: 40, flexWrap: "wrap" }}>
          <button onClick={() => setActiveEra(null)} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 18px", background: !activeEra ? AMBER : WHITE, color: !activeEra ? "#fff" : MUTED, border: "none", cursor: "pointer", fontWeight: !activeEra ? 700 : 400, flex: "1 1 80px" }}>All Eras</button>
          {ERAS.map((e) => (
            <button key={e.id} onClick={() => setActiveEra(activeEra === e.id ? null : e.id)} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 18px", background: activeEra === e.id ? e.color : WHITE, color: activeEra === e.id ? "#fff" : MUTED, border: "none", cursor: "pointer", fontWeight: activeEra === e.id ? 700 : 400, flex: "1 1 80px", transition: "background 0.15s" }}>{e.name}</button>
          ))}
        </div>

        {/* Verse cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 56 }}>
          {filtered.map((v) => {
            const era = ERAS.find((e) => e.id === v.era)!;
            return (
              <div key={v.id} style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: `1px solid ${BORDER}`, background: "#faf7f2" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 3, height: 36, background: era.color, borderRadius: 2 }} />
                    <div>
                      <p style={{ fontFamily: "'Lora', serif", fontSize: "1.05rem", fontWeight: 600, color: FG }}>{v.text}</p>
                      <p style={{ fontFamily: "'Source Sans 3'", fontSize: "0.74rem", color: MUTED, marginTop: 1 }}>{era.name} · {era.period}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Source Sans 3'", fontStyle: "italic", fontSize: "0.8rem", color: MUTED }}>— {v.poet}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ padding: "28px 28px", borderRight: `1px solid ${BORDER}` }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: 14 }}>Tamil</p>
                    <p style={{ fontFamily: "'Lora', serif", fontSize: "1.2rem", lineHeight: 2, color: FG, whiteSpace: "pre-line" }}>
                      {v.verse.split(/\s+/).map((w, i) => {
                        const isClick = v.clickableWords.includes(w);
                        return (
                          <span key={i}>
                            <span
                              onMouseEnter={() => isClick && setHoveredWord(w)}
                              onMouseLeave={() => setHoveredWord(null)}
                              onClick={() => isClick && navigate(`/word/${w}`)}
                              style={{ color: isClick ? (hoveredWord === w ? AMBER : "#8a5e10") : FG, cursor: isClick ? "pointer" : "default", borderBottom: isClick ? `1px dotted #c49030` : "none", transition: "color 0.12s" }}
                            >{w}</span>
                            {" "}
                          </span>
                        );
                      })}
                    </p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: MUTED, marginTop: 14, opacity: 0.8 }}>↑ dotted words open Word Analytics</p>
                  </div>
                  <div style={{ padding: "28px 28px" }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: 14 }}>Translation</p>
                    <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1.05rem", lineHeight: 2, color: FG2, whiteSpace: "pre-line" }}>{v.translation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corpus index */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, background: BG }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "1.2rem", fontWeight: 600, color: FG }}>Full Corpus Index</h2>
          </div>
          {ERAS.map((era, ei) => (
            <div key={era.id} style={{ borderBottom: ei < ERAS.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, background: "#faf7f2" }}>
                <div style={{ width: 3, height: 20, background: era.color, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Lora', serif", fontSize: "1rem", fontWeight: 600, color: FG, flex: 1 }}>{era.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: MUTED }}>{era.period}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: AMBER }}>{era.wordCount.toLocaleString()} words</span>
              </div>
              <div style={{ padding: "10px 24px 14px 43px", display: "flex", gap: 8, flexWrap: "wrap", background: WHITE }}>
                {era.texts.map((t) => (
                  <span key={t} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", color: FG2, background: BG, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "3px 10px" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
