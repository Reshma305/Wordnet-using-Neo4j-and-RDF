import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AMBER, BORDER, MUTED, FG, FG2, FEATURED_WORDS } from "../data";

const BG_LETTERS = [
  "அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ","க","ங","ச","ஞ","ட","ண",
  "த","ந","ப","ம","ய","ர","ல","வ","ழ","ள","ற","ன","ஸ","ஷ","ஜ","ஹ",
];

function FloatingLetter({ letter, style }: { letter: string; style: React.CSSProperties }) {
  return (
    <span
      style={{
        position: "absolute",
        fontFamily: "'Lora', serif",
        color: AMBER,
        opacity: 0.04,
        userSelect: "none",
        pointerEvents: "none",
        animation: `floatUp ${8 + Math.random() * 8}s linear infinite`,
        ...style,
      }}
    >
      {letter}
    </span>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeWord, setActiveWord] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setActiveWord((w) => (w + 1) % FEATURED_WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/word/${encodeURIComponent(q)}`);
  }

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", position: "relative", overflow: "hidden" }}>
      {/* Floating background letters */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {BG_LETTERS.map((l, i) => (
          <FloatingLetter
            key={i}
            letter={l}
            style={{
              left: `${(i * 37) % 95}%`,
              top: `${(i * 53) % 110}%`,
              fontSize: `${2 + (i % 5)}rem`,
              animationDelay: `${(i * 0.7) % 10}s`,
              animationDuration: `${10 + (i % 8)}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
          5%   { opacity: 0.05; }
          95%  { opacity: 0.04; }
          100% { transform: translateY(-120vh) rotate(20deg); opacity: 0; }
        }
        @keyframes pulse-amber {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,146,42,0.3); }
          50%       { box-shadow: 0 0 0 12px rgba(200,146,42,0); }
        }
        @keyframes fade-cycle {
          0%, 100% { opacity: 0; transform: translateY(6px); }
          15%, 85% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Hero */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 56px)",
          padding: "60px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: AMBER,
            marginBottom: 24,
            opacity: 0.8,
          }}
        >
          Tamil Corpus Analytics · 309,600 Words Indexed
        </p>

        {/* Main title */}
        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            fontWeight: 700,
            color: FG,
            lineHeight: 0.9,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          நவிழி
        </h1>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            color: FG2,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Navizhi
        </p>
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)",
            color: MUTED,
            maxWidth: 520,
            textAlign: "center",
            lineHeight: 1.65,
            marginBottom: 52,
          }}
        >
          Explore how Tamil words live, shift, and endure across 2,300 years of literature.
          From Sangam verse to Bhakti hymn to modern prose.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: 0, width: "100%", maxWidth: 480, marginBottom: 52 }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a Tamil word or transliteration…"
            style={{
              flex: 1,
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1rem",
              background: "#1a1814",
              border: `1px solid ${AMBER}`,
              borderRight: "none",
              borderRadius: "4px 0 0 4px",
              padding: "14px 20px",
              color: FG,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: AMBER,
              color: "#0f0e0c",
              border: "none",
              borderRadius: "0 4px 4px 0",
              padding: "14px 28px",
              cursor: "pointer",
              animation: "pulse-amber 2.5s ease-in-out infinite",
            }}
          >
            Explore
          </button>
        </form>

        {/* Featured words ticker */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Featured words
          </p>
          <div style={{ position: "relative", height: 60, overflow: "hidden" }}>
            {FEATURED_WORDS.map((w, i) => (
              <div
                key={w.word}
                onClick={() => navigate(`/word/${w.word}`)}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: i === activeWord ? 1 : 0,
                  transform: i === activeWord ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
              >
                <span style={{ fontFamily: "'Lora', serif", fontSize: "1.8rem", fontWeight: 700, color: AMBER }}>{w.word}</span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: MUTED }}>{w.romanized} · {w.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats row */}
        <div
          style={{
            display: "flex",
            gap: 1,
            background: BORDER,
            borderRadius: 4,
            overflow: "hidden",
            flexWrap: "wrap",
          }}
        >
          {[
            { n: "5", label: "Literary Eras" },
            { n: "14", label: "Indexed Texts" },
            { n: "309K+", label: "Words Indexed" },
            { n: "68K+", label: "Unique Lemmas" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#1a1814",
                padding: "16px 32px",
                textAlign: "center",
                flex: "1 1 120px",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5rem", color: AMBER, fontWeight: 500 }}>{s.n}</div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
