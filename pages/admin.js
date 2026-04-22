import { useState } from "react";
import Head from "next/head";

function formatTime(ts) {
  return new Date(ts).toLocaleString("en-IE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function LogEntry({ log, index }) {
  const [open, setOpen] = useState(false);
  const isResult = log.hasResults;

  return (
    <div
      style={{
        background: "#111",
        border: `1px solid ${isResult ? "#c9a84c44" : "#222"}`,
        borderRadius: "10px",
        marginBottom: "10px",
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {isResult && (
          <span
            style={{
              background: "#c9a84c22",
              color: "#c9a84c",
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "20px",
              border: "1px solid #c9a84c44",
              whiteSpace: "nowrap",
            }}
          >
            ◈ Results
          </span>
        )}
        <span style={{ color: "#888", fontSize: "13px", whiteSpace: "nowrap" }}>
          {formatTime(log.timestamp)}
        </span>
        <span
          style={{
            color: "#555",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          {log.messageCount} msgs
        </span>
        <span
          style={{
            color: "#ccc",
            fontSize: "13px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {log.userMessage?.slice(0, 120) || "—"}
        </span>
        <span style={{ color: "#555", fontSize: "13px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* Expanded body */}
      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ marginTop: "14px" }}>
            <div style={{ color: "#555", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              IP
            </div>
            <div style={{ color: "#666", fontSize: "13px" }}>{log.ip}</div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <div style={{ color: "#555", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              User message
            </div>
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "8px",
                padding: "12px",
                color: "#ddd",
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
              }}
            >
              {log.userMessage || "—"}
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <div style={{ color: "#555", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              AI response
            </div>
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "8px",
                padding: "12px",
                color: "#aaa",
                fontSize: "13px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {log.aiResponse || "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const fetchLogs = async (pw, off = 0) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/logs?password=${encodeURIComponent(pw)}&limit=${LIMIT}&offset=${off}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load");
        return;
      }
      if (off === 0) {
        setLogs(data.logs);
      } else {
        setLogs((prev) => [...prev, ...data.logs]);
      }
      setTotal(data.total);
      setAuthed(true);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLogs(password, 0);
  };

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchLogs(password, newOffset);
  };

  if (!authed) {
    return (
      <>
        <Head>
          <title>Compass Admin</title>
        </Head>
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ width: "320px" }}>
            <div style={{ color: "#c9a84c", fontSize: "24px", textAlign: "center", marginBottom: "32px" }}>
              ◈ Compass Admin
            </div>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "15px",
                  marginBottom: "12px",
                  boxSizing: "border-box",
                }}
              />
              {error && (
                <div style={{ color: "#e05555", fontSize: "13px", marginBottom: "12px" }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#c9a84c",
                  border: "none",
                  borderRadius: "8px",
                  color: "#000",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Checking…" : "View Logs"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Compass Admin — Logs</title>
      </Head>
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
          padding: "32px 24px",
          maxWidth: "860px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <div style={{ color: "#c9a84c", fontSize: "20px", fontWeight: "600" }}>
              ◈ Compass — Conversation Logs
            </div>
            <div style={{ color: "#555", fontSize: "13px", marginTop: "4px" }}>
              {total} total entries logged
            </div>
          </div>
          <button
            onClick={() => fetchLogs(password, 0)}
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#aaa",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {logs.length === 0 && !loading && (
          <div style={{ color: "#555", textAlign: "center", marginTop: "60px" }}>
            No logs yet. They'll appear here once users start conversations.
          </div>
        )}

        {logs.map((log, i) => (
          <LogEntry key={i} log={log} index={i} />
        ))}

        {loading && (
          <div style={{ color: "#555", textAlign: "center", padding: "24px" }}>
            Loading…
          </div>
        )}

        {logs.length < total && !loading && (
          <button
            onClick={loadMore}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
              background: "#111",
              border: "1px solid #333",
              color: "#aaa",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Load more ({total - logs.length} remaining)
          </button>
        )}
      </div>
    </>
  );
}
