import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { WORD_CLUSTERS } from "../data";

const BG     = "#faf7f2";
const WHITE  = "#ffffff";
const FG     = "#1a1612";
const FG2    = "#3d3428";
const MUTED  = "#7a6e5e";
const BORDER = "#e0d8cc";
const AMBER  = "#b07820";

type Node = { word: string; romanized: string; x: number; y: number; cluster: string; color: string };

export default function WordMap() {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const allNodes: Node[] = WORD_CLUSTERS.flatMap((c) =>
    c.words.map((w) => ({ ...w, cluster: c.cluster, color: c.color }))
  );

  const edges: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  WORD_CLUSTERS.forEach((c) => {
    for (let i = 0; i < c.words.length; i++) {
      for (let j = i + 1; j < c.words.length; j++) {
        edges.push({ x1: c.words[i].x, y1: c.words[i].y, x2: c.words[j].x, y2: c.words[j].y, color: c.color });
      }
    }
  });

  const crossEdges = [
    { x1: 25, y1: 55, x2: 50, y2: 30 },
    { x1: 30, y1: 25, x2: 45, y2: 18 },
    { x1: 10, y1: 60, x2: 30, y2: 25 },
  ];

  const dimmed = (node: Node) => activeCluster !== null && node.cluster !== activeCluster;

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: BG, color: FG }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 64px" }}>

        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: AMBER, marginBottom: 8 }}>Semantic Network · {allNodes.length} Words Mapped</p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: FG, lineHeight: 1.1, marginBottom: 12 }}>Word Constellation</h1>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "1rem", color: FG2, maxWidth: 520 }}>
            Semantic clusters drawn from co-occurrence analysis. Click a word to explore its analytics. Filter by cluster below.
          </p>
        </div>

        {/* Cluster filter */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          <button onClick={() => setActiveCluster(null)} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", padding: "6px 14px", background: !activeCluster ? AMBER : WHITE, color: !activeCluster ? "#fff" : MUTED, border: `1px solid ${!activeCluster ? AMBER : BORDER}`, borderRadius: 4, cursor: "pointer", fontWeight: !activeCluster ? 700 : 400 }}>All</button>
          {WORD_CLUSTERS.map((c) => (
            <button key={c.cluster} onClick={() => setActiveCluster(activeCluster === c.cluster ? null : c.cluster)} style={{ fontFamily: "'Source Sans 3'", fontSize: "0.78rem", padding: "6px 14px", background: activeCluster === c.cluster ? c.color : WHITE, color: activeCluster === c.cluster ? "#fff" : FG2, border: `1px solid ${activeCluster === c.cluster ? c.color : BORDER}`, borderRadius: 4, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8, fontWeight: activeCluster === c.cluster ? 700 : 400 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, display: "inline-block" }} />
              {c.cluster}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", opacity: 0.7 }}>({c.words.length})</span>
            </button>
          ))}
        </div>

        {/* SVG canvas */}
        <div style={{ position: "relative", background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <svg ref={svgRef} viewBox="0 0 100 100" style={{ width: "100%", height: "auto", aspectRatio: "16/9", display: "block" }} preserveAspectRatio="xMidYMid meet">
            {/* Subtle grid */}
            {Array.from({ length: 20 }).map((_, i) =>
              Array.from({ length: 12 }).map((_, j) => (
                <circle key={`${i}-${j}`} cx={i * 5.5} cy={j * 9} r={0.1} fill="#e0d8cc" />
              ))
            )}

            {/* Cross-cluster edges */}
            {crossEdges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#cdc4b6" strokeWidth={0.15} strokeDasharray="0.5 0.5" />
            ))}

            {/* Intra-cluster edges */}
            {edges.map((e, i) => {
              const clusterName = WORD_CLUSTERS.find((c) => c.color === e.color)?.cluster;
              const dim = activeCluster !== null && clusterName !== activeCluster;
              return <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.color} strokeWidth={0.25} opacity={dim ? 0.08 : 0.35} style={{ transition: "opacity 0.25s" }} />;
            })}

            {/* Nodes */}
            {allNodes.map((node) => {
              const dim = dimmed(node);
              const isHov = hoveredNode?.word === node.word;
              return (
                <g key={node.word} style={{ cursor: "pointer", transition: "opacity 0.25s" }} opacity={dim ? 0.12 : 1} onMouseEnter={() => setHoveredNode(node)} onMouseLeave={() => setHoveredNode(null)} onClick={() => navigate(`/word/${node.word}`)}>
                  {isHov && <circle cx={node.x} cy={node.y} r={2.6} fill="none" stroke={node.color} strokeWidth={0.3} opacity={0.4} />}
                  <circle cx={node.x} cy={node.y} r={isHov ? 1.4 : 1} fill={node.color} />
                  <text x={node.x} y={node.y - 1.8} textAnchor="middle" style={{ fontFamily: "'Lora', serif", fontSize: isHov ? "2.4px" : "1.9px", fill: isHov ? node.color : FG, fontWeight: isHov ? "bold" : "normal", transition: "font-size 0.1s" }}>{node.word}</text>
                  <text x={node.x} y={node.y + 3} textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1px", fill: MUTED }}>{node.romanized}</text>
                </g>
              );
            })}

            {/* Cluster labels */}
            {WORD_CLUSTERS.map((c) => {
              const xs = c.words.map((w) => w.x);
              const ys = c.words.map((w) => w.y);
              const cx = xs.reduce((a, b) => a + b) / xs.length;
              const cy = Math.min(...ys) - 5;
              const dim = activeCluster !== null && c.cluster !== activeCluster;
              return (
                <text key={c.cluster} x={cx} y={cy} textAnchor="middle" opacity={dim ? 0.1 : 0.7} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5px", fill: c.color, letterSpacing: "0.5px", transition: "opacity 0.25s" }}>
                  {c.cluster.toUpperCase()}
                </text>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredNode && (
            <div style={{ position: "absolute", bottom: 16, left: 20, background: WHITE, border: `1.5px solid ${hoveredNode.color}`, borderRadius: 6, padding: "12px 18px", pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Lora', serif", fontSize: "1.5rem", fontWeight: 700, color: hoveredNode.color }}>{hoveredNode.word}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: MUTED }}>{hoveredNode.romanized}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: hoveredNode.color, display: "inline-block" }} />
                <span style={{ fontFamily: "'Source Sans 3'", fontSize: "0.8rem", color: FG2 }}>{hoveredNode.cluster} cluster</span>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: MUTED, marginTop: 5 }}>Click to open Word Analytics →</p>
            </div>
          )}
        </div>

        {/* Cluster cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 24 }}>
          {WORD_CLUSTERS.map((c) => (
            <div key={c.cluster} onClick={() => setActiveCluster(activeCluster === c.cluster ? null : c.cluster)} style={{ background: WHITE, border: `1.5px solid ${activeCluster === c.cluster ? c.color : BORDER}`, borderRadius: 6, padding: "16px 20px", cursor: "pointer", transition: "border-color 0.15s", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                <div>
                  <span style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", fontWeight: 600, color: FG }}>{c.cluster}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: MUTED, marginLeft: 8 }}>{c.tamil}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {c.words.map((w) => (
                  <span key={w.word} onClick={(e) => { e.stopPropagation(); navigate(`/word/${w.word}`); }} style={{ fontFamily: "'Lora', serif", fontSize: "0.95rem", color: c.color, cursor: "pointer", borderBottom: `1px dotted ${c.color}` }}>{w.word}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
