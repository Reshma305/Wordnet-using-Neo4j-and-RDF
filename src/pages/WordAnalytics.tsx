import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  searchLiteraryOccurrences,
  type LiteraryOccurrence,
} from "../services/api";

const BG = "#faf7f2";
const WHITE = "#ffffff";
const AMBER = "#b07820";
const A_DIM = "#d4a84a";
const A_BG = "#fdf3e0";
const FG = "#1a1612";
const FG2 = "#3d3428";
const MUTED = "#7a6e5e";
const BORDER = "#e0d8cc";
const SURF2 = "#f7f2ea";

/*
 * These analytics values are existing demo UI data.
 * They are NOT presented as live Neo4j measurements.
 */
const eraData = [
  { era: "Sangam", count: 412 },
  { era: "Post-Sangam", count: 289 },
  { era: "Bhakti", count: 538 },
  { era: "Medieval", count: 301 },
  { era: "Modern", count: 175 },
];

const sourceData = [
  { source: "Thevaram", count: 203, genre: "Bhakti hymns" },
  { source: "Akananuru", count: 118, genre: "Sangam anthology" },
  { source: "Purananuru", count: 97, genre: "Sangam anthology" },
  { source: "Kambaramayanam", count: 89, genre: "Medieval epic" },
  { source: "Silappatikaram", count: 61, genre: "Epic" },
  { source: "Folk songs", count: 45, genre: "Oral tradition" },
  { source: "Thirukkural", count: 42, genre: "Didactic verse" },
];

const senseData = [
  {
    sense: "Romantic love",
    pct: 38,
    example: "உள்ளத்தின் அன்பு — love of the heart",
  },
  {
    sense: "Parental affection",
    pct: 27,
    example: "தாய் அன்பு — a mother's love",
  },
  {
    sense: "Devotional love",
    pct: 21,
    example: "இறை அன்பு — love of the divine",
  },
  {
    sense: "Compassion / kindness",
    pct: 14,
    example: "உயிர் அன்பு — compassion for living beings",
  },
];

const relatedWords = [
  {
    word: "காதல்",
    romanized: "kādal",
    relation: "Romantic longing",
    co: 0.82,
  },
  {
    word: "கருணை",
    romanized: "karuṇai",
    relation: "Compassion",
    co: 0.74,
  },
  {
    word: "பாசம்",
    romanized: "pācam",
    relation: "Attachment, bond",
    co: 0.68,
  },
  {
    word: "நேசம்",
    romanized: "nēcam",
    relation: "Friendship, fondness",
    co: 0.61,
  },
  {
    word: "இரக்கம்",
    romanized: "irakkaṁ",
    relation: "Sympathy, pity",
    co: 0.55,
  },
  {
    word: "அருள்",
    romanized: "aruḷ",
    relation: "Divine grace",
    co: 0.49,
  },
];

const total = eraData.reduce((sum, item) => sum + item.count, 0);

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      era?: string;
      source?: string;
      genre?: string;
      count?: number;
    };
  }>;
}

const EraTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div
      style={{
        background: WHITE,
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        padding: "8px 14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          fontFamily: "'Source Sans 3'",
          fontSize: "0.78rem",
          color: FG2,
        }}
      >
        {data.era}
      </p>

      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.9rem",
          color: AMBER,
        }}
      >
        {data.count} occurrences
      </p>
    </div>
  );
};

const SrcTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div
      style={{
        background: WHITE,
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        padding: "8px 14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          fontFamily: "'Source Sans 3'",
          fontSize: "0.78rem",
          color: FG2,
        }}
      >
        {data.source}
      </p>

      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          color: MUTED,
          marginBottom: 2,
        }}
      >
        {data.genre}
      </p>

      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.9rem",
          color: AMBER,
        }}
      >
        {data.count} occurrences
      </p>
    </div>
  );
};

export default function WordAnalytics() {
  const { word = "அன்பு" } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"era" | "sources">("era");
  const [hovered, setHovered] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(
    decodeURIComponent(word || "அன்பு")
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [occurrences, setOccurrences] = useState<LiteraryOccurrence[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const decodedWord = decodeURIComponent(word || "");

  /*
   * Search the real FastAPI + Neo4j literary backend.
   */
  const fetchLiteraryOccurrences = async (query: string) => {
    const cleanWord = query.trim();

    if (!cleanWord) {
      setError("தமிழ் சொல்லை உள்ளிடவும்.");
      setOccurrences([]);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchLiteraryOccurrences(cleanWord, 20);

      setOccurrences(response.results);
    } catch (err: unknown) {
      console.error(err);

      setOccurrences([]);

      setError(
        err instanceof Error
          ? err.message
          : "இலக்கியத் தேடலில் பிழை ஏற்பட்டது."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Search whenever the URL word changes.
   */
  useEffect(() => {
    const cleanWord = decodedWord.trim();

    if (!cleanWord) {
      setOccurrences([]);
      setHasSearched(false);
      return;
    }

    setSearchInput(cleanWord);

    void fetchLiteraryOccurrences(cleanWord);
  }, [decodedWord]);

  const handleSearch = () => {
    const cleanWord = searchInput.trim();

    if (!cleanWord) {
      setError("தமிழ் சொல்லை உள்ளிடவும்.");
      return;
    }

    navigate(`/word/${encodeURIComponent(cleanWord)}`);
  };

  const handleOccurrenceWordSearch = (selectedWord: string) => {
    navigate(`/word/${encodeURIComponent(selectedWord)}`);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        background: BG,
        color: FG,
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: "10px 32px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: WHITE,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'Source Sans 3'",
            fontSize: "0.8rem",
            color: MUTED,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Home
        </button>

        <span style={{ color: BORDER }}>›</span>

        <span
          style={{
            fontFamily: "'Source Sans 3'",
            fontSize: "0.8rem",
            color: FG2,
          }}
        >
          Word Insights
        </span>

        <span style={{ color: BORDER }}>›</span>

        <span
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "0.9rem",
            color: AMBER,
          }}
        >
          {decodedWord}
        </span>
      </div>

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 32px 64px",
        }}
      >
        {/* Word hero */}
        <div
          style={{
            marginBottom: 36,
            borderBottom: `1px solid ${BORDER}`,
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 700,
                color: FG,
                lineHeight: 1,
                margin: 0,
              }}
            >
              {decodedWord}
            </h1>

            <div style={{ paddingBottom: 8 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1rem",
                  color: AMBER,
                  display: "block",
                }}
              >
                {decodedWord}
              </span>

              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: FG2,
                }}
              >
                Tamil Literary Context
              </span>
            </div>
          </div>

          {/* Search */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              maxWidth: 700,
            }}
          >
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="தமிழ் சொல்லை தேடுங்கள்..."
              aria-label="Tamil word search"
              style={{
                flex: 1,
                minWidth: 240,
                padding: "13px 16px",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                background: WHITE,
                color: FG,
                fontFamily: "'Lora', serif",
                fontSize: "1rem",
                outline: "none",
              }}
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: "13px 24px",
                border: `1px solid ${AMBER}`,
                borderRadius: 6,
                background: AMBER,
                color: WHITE,
                fontFamily: "'Source Sans 3'",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "தேடுகிறது..." : "தேடு"}
            </button>
          </div>

          {/* Stat strip */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 36,
              flexWrap: "wrap",
              padding: "20px 24px",
              background: WHITE,
              borderRadius: 6,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: MUTED,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 3,
                }}
              >
                Literary occurrences
              </span>

              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.1rem",
                  color: AMBER,
                  fontWeight: 500,
                }}
              >
                {loading ? "..." : occurrences.length}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: MUTED,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 3,
                }}
              >
                Books found
              </span>

              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.1rem",
                  color: AMBER,
                  fontWeight: 500,
                }}
              >
                {new Set(occurrences.map((item) => item.book)).size}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: MUTED,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 3,
                }}
              >
                Corpus passages
              </span>

              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.1rem",
                  color: AMBER,
                  fontWeight: 500,
                }}
              >
                1,724
              </span>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: MUTED,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Search source
              </span>

              <div
                style={{
                  position: "relative",
                  height: 8,
                  background: "#ede6da",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    width: "100%",
                    background: `linear-gradient(90deg, ${A_DIM}, ${AMBER})`,
                    borderRadius: 4,
                  }}
                />
              </div>

              <span
                style={{
                  fontFamily: "'Source Sans 3'",
                  fontSize: "0.72rem",
                  color: MUTED,
                  marginTop: 4,
                  display: "block",
                }}
              >
                Results retrieved from the literary corpus through Neo4j
              </span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              marginBottom: 24,
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              padding: "14px 18px",
              color: MUTED,
              fontFamily: "'Source Sans 3'",
              fontSize: "0.9rem",
            }}
          >
            இலக்கியத்தில் தேடுகிறது...
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 24,
              background: "#fff7f3",
              border: "1px solid #f0c9b6",
              borderRadius: 6,
              padding: "14px 18px",
              color: FG2,
              fontFamily: "'Source Sans 3'",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* No results */}
        {!loading &&
          hasSearched &&
          occurrences.length === 0 &&
          !error && (
            <div
              style={{
                marginBottom: 24,
                background: WHITE,
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: "18px",
                color: MUTED,
                fontFamily: "'Source Sans 3'",
                fontSize: "0.9rem",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: FG,
                  marginBottom: 6,
                }}
              >
                இலக்கியப் பயன்பாடுகள் இல்லை
              </strong>

              இந்த சொல்லுக்கான இலக்கிய நிகழ்வுகள் கிடைக்கவில்லை.
            </div>
          )}

        {/* Analytics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            marginBottom: 24,
          }}
        >
          {/* Chart panel */}
          <div
            style={{
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              padding: "24px 24px 16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                marginBottom: 24,
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              {(["era", "sources"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTab(type)}
                  style={{
                    fontFamily: "'Source Sans 3'",
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "8px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom:
                      tab === type
                        ? `2px solid ${AMBER}`
                        : "2px solid transparent",
                    color: tab === type ? AMBER : MUTED,
                    cursor: "pointer",
                    marginBottom: -1,
                  }}
                >
                  {type === "era" ? "Era Trend" : "Source Distribution"}
                </button>
              ))}
            </div>

            {tab === "era" && (
              <>
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                    color: MUTED,
                    marginBottom: 16,
                  }}
                >
                  Corpus-frequency by literary era — demo analytics
                </p>

                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart
                    data={eraData}
                    margin={{
                      top: 4,
                      right: 8,
                      left: -20,
                      bottom: 4,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="ag"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={AMBER}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={AMBER}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="era"
                      tick={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        fill: MUTED,
                      }}
                      axisLine={{ stroke: BORDER }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        fill: MUTED,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      content={<EraTooltip />}
                      cursor={{ stroke: BORDER }}
                    />

                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={AMBER}
                      strokeWidth={2}
                      fill="url(#ag)"
                      dot={{
                        fill: AMBER,
                        r: 3,
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 5,
                        fill: AMBER,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>

              </>
            )}

            {tab === "sources" && (
              <>
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                    color: MUTED,
                    marginBottom: 16,
                  }}
                >
                  
                </p>

                <ResponsiveContainer width="100%" height={210}>
                  <BarChart
                    data={sourceData}
                    layout="vertical"
                    margin={{
                      top: 0,
                      right: 16,
                      left: 4,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      type="number"
                      tick={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        fill: MUTED,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="source"
                      width={110}
                      tick={{
                        fontFamily: "'Source Sans 3'",
                        fontSize: 10,
                        fill: FG2,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      content={<SrcTooltip />}
                      cursor={{ fill: "#f7f2ea" }}
                    />

                    <Bar
                      dataKey="count"
                      radius={[0, 3, 3, 0]}
                    >
                      {sourceData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            index % 2 === 0
                              ? AMBER
                              : A_DIM
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>

          {/* Sense distribution */}
          <div
            style={{
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: FG,
                marginBottom: 4,
              }}
            >
              Sense Distribution
            </h2>

            <p
              style={{
                fontFamily: "'Source Sans 3'",
                fontSize: "0.78rem",
                color: MUTED,
                marginBottom: 24,
              }}
            >
              Existing demo interpretation of contextual meaning
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              {senseData.map((sense, index) => (
                <div key={sense.sense}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Source Sans 3'",
                        fontSize: "0.9rem",
                        color: FG,
                        fontWeight: 500,
                      }}
                    >
                      {sense.sense}
                    </span>

                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.85rem",
                        color: AMBER,
                        fontWeight: 500,
                      }}
                    >
                      {sense.pct}%
                    </span>
                  </div>

                  <div
                    style={{
                      height: 7,
                      background: "#ede6da",
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${sense.pct}%`,
                        background:
                          [
                            AMBER,
                            "#c49030",
                            "#a87828",
                            "#8a6020",
                          ][index],
                        borderRadius: 4,
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontFamily: "'Lora', serif",
                      fontStyle: "italic",
                      fontSize: "0.74rem",
                      color: MUTED,
                      marginTop: 5,
                    }}
                  >
                    {sense.example}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'Source Sans 3'",
                  fontSize: "0.72rem",
                  color: MUTED,
                }}
              >
              </p>
            </div>
          </div>
        </div>

        {/* REAL LITERARY OCCURRENCES */}
        <div
          style={{
            background: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            padding: 24,
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 20,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: FG,
                  marginBottom: 2,
                }}
              >
                இலக்கியத்தில் பயன்பாடுகள்
              </h2>

              <p
                style={{
                  fontFamily: "'Source Sans 3'",
                  fontSize: "0.78rem",
                  color: MUTED,
                }}
              >
                Real literary occurrences retrieved from Neo4j
              </p>
            </div>

            {occurrences.length > 0 && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.68rem",
                  color: MUTED,
                  letterSpacing: "0.06em",
                }}
              >
                {occurrences.length} RESULTS
              </span>
            )}
          </div>

          {loading && (
            <div
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: 20,
                color: MUTED,
                fontFamily: "'Source Sans 3'",
              }}
            >
              இலக்கியத் தரவுகளைப் பெறுகிறது...
            </div>
          )}

          {!loading && occurrences.length === 0 && (
            <div
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: 20,
                color: MUTED,
                fontFamily: "'Source Sans 3'",
              }}
            >
              தேடப்பட்ட சொல்லுக்கான இலக்கிய நிகழ்வுகள் இங்கு தோன்றும்.
            </div>
          )}

          {!loading && occurrences.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {occurrences.map((occurrence) => (
                <article
                  key={occurrence.passage_id}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    background:
                      occurrence.book === "திருக்குறள்"
                        ? WHITE
                        : SURF2,
                    padding: 18,
                  }}
                >
                  {/* Source metadata */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Source Sans 3'",
                          fontSize: "0.74rem",
                          color: MUTED,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {occurrence.book}
                      </span>

                      {occurrence.number !== null && (
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            color: AMBER,
                          }}
                        >
                          {occurrence.book === "திருக்குறள்"
                            ? `குறள் ${occurrence.number}`
                            : `பாடல் ${occurrence.number}`}
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        color: MUTED,
                      }}
                    >
                      {occurrence.passage_id}
                    </span>
                  </div>

                  {/* Title */}
                  {occurrence.title && (
                    <h3
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "1rem",
                        color: FG,
                        marginBottom: 6,
                      }}
                    >
                      {occurrence.title}
                    </h3>
                  )}

                  {/* Section */}
                  {occurrence.section && (
                    <p
                      style={{
                        fontFamily: "'Source Sans 3'",
                        fontSize: "0.76rem",
                        color: MUTED,
                        marginBottom: 4,
                      }}
                    >
                      பகுதி: {occurrence.section}
                    </p>
                  )}

                  {/* Poet */}
                  {occurrence.poet && (
                    <p
                      style={{
                        fontFamily: "'Source Sans 3'",
                        fontSize: "0.76rem",
                        color: MUTED,
                        marginBottom: 4,
                      }}
                    >
                      ஆசிரியர்: {occurrence.poet}
                    </p>
                  )}

                  {/* Purananuru metadata */}
                  {occurrence.sung_for && (
                    <p
                      style={{
                        fontFamily: "'Source Sans 3'",
                        fontSize: "0.76rem",
                        color: MUTED,
                        marginBottom: 4,
                      }}
                    >
                      பாடப்பட்டது: {occurrence.sung_for}
                    </p>
                  )}

                  {/* Literary text */}
                  <div
                    style={{
                      marginTop: 14,
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      padding: "16px 18px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "1rem",
                        lineHeight: 1.9,
                        color: FG,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {occurrence.text}
                    </p>
                  </div>

                  {/* Classification */}
                  {(occurrence.thinai || occurrence.thurai) && (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 12,
                      }}
                    >
                      {occurrence.thinai && (
                        <span
                          style={{
                            fontFamily: "'Source Sans 3'",
                            fontSize: "0.7rem",
                            color: FG2,
                            background: A_BG,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 999,
                            padding: "4px 10px",
                          }}
                        >
                          திணை: {occurrence.thinai}
                        </span>
                      )}

                      {occurrence.thurai && (
                        <span
                          style={{
                            fontFamily: "'Source Sans 3'",
                            fontSize: "0.7rem",
                            color: FG2,
                            background: A_BG,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 999,
                            padding: "4px 10px",
                          }}
                        >
                          துறை: {occurrence.thurai}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Related words */}
        <div
          style={{
            background: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            padding: 24,
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 20,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: FG,
                  marginBottom: 2,
                }}
              >
                Related Words
              </h2>

              <p
                style={{
                  fontFamily: "'Source Sans 3'",
                  fontSize: "0.78rem",
                  color: MUTED,
                }}
              >
            
              </p>
            </div>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                color: MUTED,
                letterSpacing: "0.06em",
              }}
            >
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 1,
              background: BORDER,
            }}
          >
            {relatedWords.map((related) => (
              <div
                key={related.word}
                onClick={() =>
                  handleOccurrenceWordSearch(related.word)
                }
                onMouseEnter={() =>
                  setHovered(related.word)
                }
                onMouseLeave={() => setHovered(null)}
                style={{
                  background:
                    hovered === related.word
                      ? A_BG
                      : WHITE,
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "background 0.12s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        color:
                          hovered === related.word
                            ? AMBER
                            : FG,
                      }}
                    >
                      {related.word}
                    </span>

                    <span
                      style={{
                        fontFamily:
                          "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        color: MUTED,
                      }}
                    >
                      {related.romanized}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Source Sans 3'",
                      fontSize: "0.78rem",
                      color: MUTED,
                      marginTop: 2,
                    }}
                  >
                    {related.relation}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "'JetBrains Mono', monospace",
                      fontSize: "1rem",
                      color: AMBER,
                      fontWeight: 500,
                    }}
                  >
                    {related.co.toFixed(2)}
                  </div>

                  <div
                    style={{
                      width: 56,
                      height: 4,
                      background: "#ede6da",
                      borderRadius: 2,
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${related.co * 100}%`,
                        background: AMBER,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Source Sans 3'",
            fontSize: "0.72rem",
            color: MUTED,
            marginTop: 28,
            textAlign: "center",
          }}
        >
                 </p>
      </main>
    </div>
  );
}