import Head from "next/head";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/App.module.css";

const WELCOME_LINES = [
  "Most people spend their lives in careers chosen by circumstance.",
  "Compass asks the questions no one else thinks to ask.",
  "In about 10 minutes, you'll have more clarity than most people find in years.",
];

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong, please try again");
      }
    } catch {
      setError("Something went wrong, please try again");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: "center", padding: "20px",
        background: "rgba(201,168,76,0.1)",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: 12, marginTop: 32
      }}>
        <p style={{ color: "#c9a84c", margin: 0, fontWeight: 600 }}>
          ✓ You're in — welcome to Compass.
        </p>
        <p style={{ color: "#888", fontSize: 13, marginTop: 6 }}>
          We'll send you career insights and updates.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: 24, marginTop: 32, textAlign: "center"
    }}>
      <p style={{ color: "#e0e0e0", fontWeight: 600, marginBottom: 6 }}>
        Save your results & get weekly career insights
      </p>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>
        No spam. Unsubscribe anytime.
      </p>
      <div style={{ display: "flex", gap: 10, maxWidth: 380, margin: "0 auto" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            flex: 1, padding: "10px 16px", borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", fontSize: 15, outline: "none"
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 20px", borderRadius: 8,
            background: "#c9a84c", color: "#000",
            fontWeight: 700, border: "none", cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "..." : "Join"}
        </button>
      </div>
      {error && (
        <p style={{ color: "#e05555", fontSize: 13, marginTop: 8 }}>{error}</p>
      )}
    </div>
  );
}

function ShareCard({ results }) {
  const [copied, setCopied] = useState(false);

  const shareText = `🧭 I just discovered my ideal career with Compass AI!\n\n"${results.primaryCareer.title}" — ${results.primaryCareer.fit}% fit\n\n${results.summary}\n\nFind your direction in 10 minutes → https://compass-vert-two.vercel.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
      border: "1px solid rgba(201,168,76,0.3)",
      borderRadius: 16, padding: 24, marginTop: 24, textAlign: "center"
    }}>
      <p style={{ color: "#c9a84c", fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 12 }}>
        ◈ SHARE YOUR RESULT
      </p>

      <div style={{
        background: "rgba(0,0,0,0.3)",
        borderRadius: 12, padding: 20, marginBottom: 16,
        textAlign: "left"
      }}>
        <p style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>🧭 Compass Career Reading</p>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          {results.primaryCareer.title}
        </p>
        <p style={{ color: "#c9a84c", fontSize: 14, marginBottom: 12 }}>
          {results.primaryCareer.fit}% match
        </p>
        <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.5 }}>
          {results.summary}
        </p>
        <p style={{ color: "#555", fontSize: 12, marginTop: 12 }}>
          compass-vert-two.vercel.app
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={handleCopy}
          style={{
            padding: "10px 24px", borderRadius: 8,
            background: copied ? "rgba(201,168,76,0.3)" : "#c9a84c",
            color: copied ? "#c9a84c" : "#000",
            fontWeight: 700, border: copied ? "1px solid #c9a84c" : "none",
            cursor: "pointer", fontSize: 14, transition: "all 0.2s"
          }}
        >
          {copied ? "✓ Copied!" : "Copy to share"}
        </button>

        
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🧭 Just discovered my ideal career with Compass AI — "${results.primaryCareer.title}" at ${results.primaryCareer.fit}% fit.\n\nFind yours in 10 minutes →`)}&url=${encodeURIComponent("https://compass-vert-two.vercel.app")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 24px", borderRadius: 8,
            background: "#1DA1F2", color: "#fff",
            fontWeight: 700, border: "none",
            cursor: "pointer", fontSize: 14,
            textDecoration: "none", display: "inline-block"
          }}
        >
          Share on X →
        </a>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={styles.typingWrap}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={styles.typingDot}
          style={{ animationDelay: `${i
