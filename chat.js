import Head from "next/head";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/App.module.css";

const WELCOME_LINES = [
  "Most people spend their lives in careers chosen by circumstance.",
  "Compass asks the questions no one else thinks to ask.",
  "In about 10 minutes, you'll have more clarity than most people find in years.",
];

/* ────────────────────────────────────────────
   SUB-COMPONENTS
──────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className={styles.typingWrap}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={styles.typingDot}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

function FitBar({ value, color = "gold" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 250);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className={styles.fitBarTrack}>
      <div
        className={`${styles.fitBarFill} ${styles[`fitBar_${color}`]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function CareerResults({ results, onDeepDive }) {
  return (
    <div className={styles.resultsWrap}>
      {/* Personal summary */}
      <div className={styles.summaryCard}>
        <div className={styles.cardTag}>Your Compass Reading</div>
        <p className={styles.summaryText}>{results.summary}</p>
      </div>

      {/* Primary */}
      <div className={styles.primaryCard}>
        <div className={styles.primaryHeader}>
          <div>
            <div className={styles.cardTag}>Primary Match</div>
            <h3 className={styles.primaryTitle}>{results.primaryCareer.title}</h3>
          </div>
          <div className={styles.fitBadge}>{results.primaryCareer.fit}% fit</div>
        </div>
        <FitBar value={results.primaryCareer.fit} color="gold" />
        <p className={styles.primaryDesc}>{results.primaryCareer.description}</p>

        <div className={styles.pathWrap}>
          <div className={styles.cardTagAlt}>Your Path Forward</div>
          {results.primaryCareer.path.map((step, i) => (
            <div key={i} className={styles.pathStep}>
              <div className={styles.pathNum}>{i + 1}</div>
              <p className={styles.pathText}>{step}</p>
            </div>
          ))}
        </div>

        <button
          className={styles.deepDiveBtn}
          onClick={() => onDeepDive(results.primaryCareer.title)}
        >
          Deep Dive into {results.primaryCareer.title} →
        </button>
      </div>

      {/* Alternatives */}
      <div className={styles.altSection}>
        <div className={styles.cardTagAlt} style={{ marginBottom: "14px" }}>
          Also Strong Matches
        </div>
        {results.alternativeCareers.map((c, i) => (
          <div
            key={i}
            className={styles.altCard}
            onClick={() => onDeepDive(c.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onDeepDive(c.title)}
          >
            <div className={styles.altHeader}>
              <span className={styles.altTitle}>{c.title}</span>
              <span className={styles.altFit}>{c.fit}%</span>
            </div>
            <FitBar value={c.fit} color="blue" />
            <p className={styles.altDesc}>{c.description}</p>
          </div>
        ))}
      </div>

      {/* Strengths + Watch Out */}
      <div className={styles.bottomGrid}>
        <div className={styles.strengthsCard}>
          <div className={styles.cardTagGreen}>Core Strengths</div>
          {results.coreStrengths.map((s, i) => (
            <div key={i} className={styles.strengthItem}>
              <span className={styles.strengthDot} />
              <span className={styles.strengthText}>{s}</span>
            </div>
          ))}
        </div>
        <div className={styles.watchCard}>
          <div className={styles.cardTagOrange}>Watch Out For</div>
          <p className={styles.watchText}>{results.watchOut}</p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────── */
export default function AppPage() {
  const [phase, setPhase] = useState("welcome"); // welcome | chat | results
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [careerResults, setCareerResults] = useState(null);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [deepDiveCareer, setDeepDiveCareer] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Stagger welcome lines
  useEffect(() => {
    if (welcomeStep < WELCOME_LINES.length) {
      const t = setTimeout(
        () => setWelcomeStep((s) => s + 1),
        800 + welcomeStep * 350
      );
      return () => clearTimeout(t);
    }
  }, [welcomeStep]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const parseResults = (text) => {
    const match = text.match(/<CAREER_RESULTS>([\s\S]*?)<\/CAREER_RESULTS>/);
    if (!match) return null;
    try {
      return JSON.parse(match[1].trim());
    } catch {
      return null;
    }
  };

  const callApi = useCallback(async (apiMessages) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Server error");
    }
    const data = await res.json();
    return data.text;
  }, []);

  const startChat = async () => {
    setPhase("chat");
    setLoading(true);
    try {
      const text = await callApi([
        { role: "user", content: "Hello, I'm ready to find my direction." },
      ]);
      setMessages([
        {
          role: "user",
          content: "Hello, I'm ready to find my direction.",
          hidden: true,
        },
        { role: "assistant", content: text },
      ]);
    } catch {
      setMessages([
        {
          role: "assistant",
          content:
            "Sorry, something went wrong connecting. Please refresh and try again.",
        },
      ]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const apiMessages = [
      { role: "user", content: "Hello, I'm ready to find my direction." },
      ...newMessages
        .filter((m) => !m.hidden)
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const text = await callApi(apiMessages);
      const results = parseResults(text);

      if (results) {
        const clean = text
          .replace(/<CAREER_RESULTS>[\s\S]*?<\/CAREER_RESULTS>/, "")
          .trim();
        if (clean) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: clean },
          ]);
        }
        setTimeout(
          () => {
            setCareerResults(results);
            setPhase("results");
          },
          clean ? 1000 : 0
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: text },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Connection issue: ${e.message}. Please try again.`,
        },
      ]);
    }
    setLoading(false);
  };

  const handleDeepDive = async (careerTitle) => {
    setDeepDiveCareer(careerTitle);
    setPhase("chat");
    setLoading(true);

    const deepDiveContent = `Tell me everything about becoming a ${careerTitle}. I want a real deep dive: what does a typical day look like, what skills and education do I need, what's a realistic timeline, what are the income ranges at different stages, what are the 3 best resources to start RIGHT NOW, and what communities should I join?`;

    const apiMessages = [
      { role: "user", content: "Hello, I'm ready to find my direction." },
      ...messages
        .filter((m) => !m.hidden)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: deepDiveContent },
    ];

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Tell me more about ${careerTitle}` },
    ]);

    try {
      const text = await callApi(apiMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: text },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Connection issue: ${e.message}. Please try again.`,
        },
      ]);
    }
    setLoading(false);
  };

  const reset = () => {
    setPhase("welcome");
    setMessages([]);
    setInput("");
    setCareerResults(null);
    setDeepDiveCareer(null);
    setWelcomeStep(0);
    setTimeout(() => setWelcomeStep(1), 80);
  };

  const visibleMessages = messages.filter((m) => !m.hidden);

  return (
    <>
      <Head>
        <title>Compass — Find Your Direction</title>
        <meta
          name="description"
          content="AI career guidance that finds your path in 10 minutes."
        />
      </Head>

      <div className={styles.root}>
        <div className={styles.orbTopRight} />
        <div className={styles.orbBottomLeft} />

        {/* NAV */}
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Compass</span>
          </Link>

          <div className={styles.headerRight}>
            {phase === "results" && (
              <button
                className={styles.headerBtn}
                onClick={() => setPhase("chat")}
              >
                Conversation
              </button>
            )}
            {phase === "chat" && careerResults && (
              <button
                className={`${styles.headerBtn} ${styles.headerBtnGold}`}
                onClick={() => setPhase("results")}
              >
                ← My Results
              </button>
            )}
            {phase !== "welcome" && (
              <button className={styles.headerBtnGhost} onClick={reset}>
                Start Over
              </button>
            )}
          </div>
        </header>

        <main className={styles.main}>
          {/* ── WELCOME ── */}
          {phase === "welcome" && (
            <div className={styles.welcomeWrap}>
              <div className={styles.welcomeBadge}>
                <span className={styles.welcomeBadgeDot} />
                AI Career Intelligence
              </div>

              <h1 className={styles.welcomeTitle}>
                Find the work
                <br />
                <em className={styles.welcomeTitleEm}>you were made for.</em>
              </h1>

              <div className={styles.welcomeLines}>
                {WELCOME_LINES.map((line, i) => (
                  <p
                    key={i}
                    className={styles.welcomeLine}
                    style={{
                      opacity: welcomeStep > i ? 1 : 0,
                      transform:
                        welcomeStep > i ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <button
                className={styles.welcomeBtn}
                onClick={startChat}
                style={{
                  opacity: welcomeStep >= WELCOME_LINES.length ? 1 : 0,
                  transform:
                    welcomeStep >= WELCOME_LINES.length
                      ? "translateY(0)"
                      : "translateY(12px)",
                  transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s, box-shadow 0.2s, background 0.2s",
                }}
              >
                Begin My Journey →
              </button>
              <p
                className={styles.welcomeNote}
                style={{
                  opacity: welcomeStep >= WELCOME_LINES.length ? 1 : 0,
                  transition: "opacity 0.5s ease 0.4s",
                }}
              >
                Takes about 10 minutes · Powered by Claude AI
              </p>
            </div>
          )}

          {/* ── CHAT ── */}
          {phase === "chat" && (
            <div className={styles.chatWrap}>
              {deepDiveCareer && (
                <div className={styles.deepDiveBanner}>
                  Deep Dive: {deepDiveCareer}
                </div>
              )}

              <div className={styles.messagesList}>
                {visibleMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${styles.msgRow} ${
                      msg.role === "user" ? styles.msgRowUser : styles.msgRowAI
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className={styles.aiAvatar}>◈</div>
                    )}
                    <div
                      className={`${styles.msgBubble} ${
                        msg.role === "user"
                          ? styles.msgBubbleUser
                          : styles.msgBubbleAI
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className={`${styles.msgRow} ${styles.msgRowAI}`}>
                    <div className={styles.aiAvatar}>◈</div>
                    <div className={`${styles.msgBubble} ${styles.msgBubbleAI}`}>
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className={styles.inputBar}>
                <div className={styles.inputWrap}>
                  <textarea
                    ref={inputRef}
                    className={styles.inputField}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 130) + "px";
                    }}
                    placeholder="Share your thoughts…"
                    rows={1}
                  />
                  <button
                    className={`${styles.sendBtn} ${
                      input.trim() && !loading ? styles.sendBtnActive : ""
                    }`}
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    aria-label="Send"
                  >
                    ↑
                  </button>
                </div>
                <p className={styles.inputHint}>
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {phase === "results" && careerResults && (
            <div className={styles.resultsPage}>
              <div className={styles.resultsPageHeader}>
                <div className={styles.resultsPageTag}>Reading Complete</div>
                <h2 className={styles.resultsPageTitle}>Your Career Map</h2>
              </div>
              <CareerResults
                results={careerResults}
                onDeepDive={handleDeepDive}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
