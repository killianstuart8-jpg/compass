import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Results.module.css";

/* ── FIT BAR ── */
function FitBar({ value, color = "gold" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className={styles.fitBarTrack}>
      <div
        className={`${styles.fitBarFill} ${styles[`fitBarFill_${color}`]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* ── RESULTS DISPLAY ── */
function CareerResultsView({ results }) {
  return (
    <div className={styles.resultsWrap}>
      {/* Summary */}
      <div className={styles.summaryCard}>
        <div className={styles.cardTag}>Your Compass Reading</div>
        <p className={styles.summaryText}>{results.summary}</p>
      </div>

      {/* Primary career */}
      <div className={styles.primaryCard}>
        <div className={styles.primaryHeader}>
          <div>
            <div className={styles.cardTag}>Primary Match</div>
            <h2 className={styles.primaryTitle}>{results.primaryCareer.title}</h2>
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
      </div>

      {/* Alternatives */}
      <div className={styles.altSection}>
        <div className={styles.cardTagAlt} style={{ marginBottom: "6px" }}>
          Also Strong Matches
        </div>
        {results.alternativeCareers.map((c, i) => (
          <div key={i} className={styles.altCard}>
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

/* ── MAIN PAGE ── */
export default function SharedResults() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/get-results?id=${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  const primaryTitle = data?.results?.primaryCareer?.title || "Career Map";

  return (
    <>
      <Head>
        <title>{`${primaryTitle} — Compass Career Map`}</title>
        <meta
          name="description"
          content="My personalised career map from Compass — AI-powered career guidance."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph for link previews */}
        <meta property="og:title" content={`${primaryTitle} — My Compass Career Map`} />
        <meta
          property="og:description"
          content="I just discovered my ideal career path with Compass. See my personalised career map."
        />
      </Head>

      <div className={styles.root}>
        <div className={styles.orbTopRight} />
        <div className={styles.orbBottomLeft} />

        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Compass</span>
          </Link>
          {status === "ready" && (
            <div className={styles.headerActions}>
              <button className={styles.btnGhost} onClick={handleCopy} style={{ fontSize: "13px" }}>
                {copied ? "✓ Copied" : "Copy Link"}
              </button>
              <button className={styles.btnPrimary} onClick={handlePrint}>
                Save as PDF
              </button>
            </div>
          )}
        </header>

        <main className={styles.main}>
          {status === "loading" && (
            <div className={styles.loadingWrap}>
              <div className={styles.loadingIcon}>◈</div>
              <p className={styles.loadingText}>Loading your career map…</p>
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorWrap}>
              <h1 className={styles.errorTitle}>Results not found</h1>
              <p className={styles.errorSub}>
                This link may have expired (results are kept for 90 days).
              </p>
              <Link href="/app" className={styles.btnPrimary} style={{ marginTop: "8px", textDecoration: "none", display: "inline-block" }}>
                Start a new session →
              </Link>
            </div>
          )}

          {status === "ready" && data && (
            <>
              <div className={styles.heroSection}>
                <div className={styles.heroTag}>Career Map</div>
                <h1 className={styles.heroTitle}>
                  {data.results.primaryCareer.title}
                </h1>
                <p className={styles.heroSub}>
                  Generated by Compass · {new Date(data.createdAt).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {/* Share URL bar */}
                <div className={styles.shareLine + " " + styles.noPrint}>
                  <span className={styles.shareUrl}>{shareUrl}</span>
                  <button className={styles.copyBtn} onClick={handleCopy}>
                    {copied ? "✓ Copied!" : "Copy link"}
                  </button>
                </div>
              </div>

              <CareerResultsView results={data.results} />
            </>
          )}
        </main>

        <footer className={styles.footer}>
          ◈ Compass — Find the work you were made for ·{" "}
          <Link href="/app" style={{ color: "inherit" }}>
            Try it free
          </Link>
        </footer>
      </div>
    </>
  );
}
