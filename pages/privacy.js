import Head from "next/head";
import Link from "next/link";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Compass</title>
      </Head>
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "60px 24px",
        color: "#ccc",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.7,
        background: "#0a0a0a",
        minHeight: "100vh"
      }}>
        <Link href="/" style={{ color: "#c9a84c", textDecoration: "none" }}>
          ← Back to Compass
        </Link>

        <h1 style={{ color: "#fff", marginTop: 32, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#888", marginBottom: 40 }}>
          Last updated: March 23, 2026
        </p>

        <p>This Privacy Policy describes how Compass ("we", "us", or "our") handles your information when you use our service at compass-vert-two.vercel.app.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>What information we collect</h2>
        <p>We collect information you provide directly during your conversation with Compass. This includes your responses to career guidance questions. We do <strong>not</strong> store your conversation history after your session ends.</p>
        <p>We automatically collect basic technical information such as your IP address (used only for rate limiting to prevent abuse) and general usage data.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>How we use your information</h2>
        <p>Your conversation content is sent directly to Anthropic (our AI provider) to generate responses. It is not stored by us after your session ends. We use IP addresses solely to enforce fair usage limits.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>Third parties</h2>
        <p>We use <strong>Anthropic</strong> to power the AI conversation. Your inputs are processed by Anthropic in accordance with their <a href="https://www.anthropic.com/privacy" target="_blank" style={{ color: "#c9a84c" }}>Privacy Policy</a>.</p>
        <p>We use <strong>Vercel</strong> to host this service. Basic access logs may be retained by Vercel per their privacy policy.</p>
        <p>We use <strong>Upstash</strong> for rate limiting. IP addresses are temporarily stored to prevent abuse of the service.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>Data retention</h2>
        <p>Compass does not store your conversation data. Session information exists only for the duration of your visit. IP address data used for rate limiting is automatically cleared after 24 hours.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>Your rights</h2>
        <p>If you are located in the EU, UK, or Ireland, you have rights under GDPR including the right to access, correct, or delete any personal data we hold about you. Since we do not store conversation content, the only data we may have is your IP address in rate-limiting logs, which is deleted automatically after 24 hours.</p>
        <p>To exercise your rights or ask any questions, contact us at: <strong>killianstuart8@gmail.com</strong></p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>Cookies</h2>
        <p>We do not use tracking cookies. Vercel may set basic technical cookies required for the service to function.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>Changes to this policy</h2>
        <p>We may update this policy from time to time. Continued use of Compass after changes means you accept the updated policy.</p>

        <h2 style={{ color: "#fff", marginTop: 32 }}>Contact</h2>
        <p>Questions about this policy? Email us at: <strong>killianstuart8@gmail.com</strong></p>

        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid #222" }}>
          <Link href="/" style={{ color: "#c9a84c", textDecoration: "none" }}>
            ← Back to Compass
          </Link>
        </div>
      </div>
    </>
  );
}


