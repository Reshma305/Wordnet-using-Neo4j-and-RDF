import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { AMBER, BORDER, MUTED, FG2 } from "../data";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/texts", label: "Texts" },
  { to: "/map", label: "Word Map" },
  { to: "/eras", label: "Eras" },
];

export default function Nav() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/word/${encodeURIComponent(q)}`);
  }

  return (
    <header
      style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        background: "#0f0e0c",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <NavLink
        to="/"
        style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 8 }}
      >
        <span
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: AMBER,
            letterSpacing: "0.02em",
          }}
        >
          நவிழி
        </span>
        <span
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.75rem",
            color: MUTED,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Navizhi
        </span>
      </NavLink>

      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            style={({ isActive }) => ({
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.82rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "6px 14px",
              textDecoration: "none",
              color: isActive ? AMBER : FG2,
              borderBottom: isActive ? `2px solid ${AMBER}` : "2px solid transparent",
              transition: "all 0.12s",
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 0 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a Tamil word…"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.82rem",
            background: "#1a1814",
            border: `1px solid ${BORDER}`,
            borderRight: "none",
            borderRadius: "4px 0 0 4px",
            padding: "6px 14px",
            color: FG2,
            width: 200,
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: AMBER,
            color: "#0f0e0c",
            border: "none",
            borderRadius: "0 4px 4px 0",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Go
        </button>
      </form>
    </header>
  );
}
