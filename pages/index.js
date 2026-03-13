import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Landing.module.css";

const TESTIMONIALS = [
  {
    quote:
      "I spent 8 years in a career that felt wrong. One conversation with Compass told me what I'd been too afraid to admit to myself.",
    name: "Maya R.",
    role: "Former accountant → UX Designer",
  },
  {
    quote:
      "The questions it asked were unlike anything I'd encountered. It didn't just find me a career — it explained exactly who I am.",
    name: "James T.",
    role: "Recent Graduate → Product Manager",
  },
  {
    quote:
      "I was skeptical of AI giving career advice. Then it described my ideal working life better than I ever could have.",
    name: "Priya K.",
    role: "Career Changer → Environmental Consultant",
  },
];

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Answer thoughtfully",
    desc: "Compass asks questions no career test ever has — about joy, energy, impact, and who you truly are.",
  },
  {
    number: "02",
    title: "Get your reading",
    desc: "After 10 minutes, receive a deeply personalised career map with fit scores, paths, and your core strengths.",
  },
  {
    number: "03",
    title: "Go deep",
    desc: "Explore any career in detail — day-in-the-life, timelines, income, the exact steps to begin this week.",
  },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setActiveTestimonial((v) => (v + 1) % TESTIMONIALS.length),
      4500
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Head>
        <title>Compass — Find the work you were made for</title>
        <meta
          name="description"
          content="AI-powered career guidance that asks the questions no one else thinks to ask. Discover your ideal career in 10 minutes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.root}>
        {/* Ambient background */}
        <div className={styles.ambientOrbTop} />
        <div className={styles.ambientOrbBottom} />
        <div className={styles.noiseOverlay} />

        {/* NAV */}
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
          <div className={styles.navInner}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◈</span>
              <span className={styles.logoText}>Compass</span>
            </div>
            <div className={styles.navLinks}>
              <a href="#how-it-works" className={styles.navLink}>
                How it works
              </a>
              <a href="#testimonials" className={styles.navLink}>
                Stories
              </a>
              <Link href="/compass" className={styles.navCta}>
                Try Free →
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            AI Career Intelligence
          </div>

          <h1 className={styles.heroTitle}>
            Find the work
            <br />
            <em className={styles.heroTitleEm}>you were made for.</em>
          </h1>

          <p className={styles.heroSub}>
            Most people spend their lives in careers chosen by circumstance.
            <br />
            Compass changes that — in about 10 minutes.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/compass" className={styles.ctaPrimary}>
              Begin My Journey
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <a href="#how-it-works" className={styles.ctaSecondary}>
              See how it works
            </a>
          </div>

          <div className={styles.heroStats}>
            {[
              ["10 min", "average session"],
              ["97%", "accuracy reported"],
              ["Free", "to try"],
            ].map(([val, label]) => (
              <div key={label} className={styles.heroStat}>
                <span className={styles.heroStatVal}>{val}</span>
                <span className={styles.heroStatLabel}>{label}</span>
              </div>
            ))}
          </div>

          {/* Decorative compass rose */}
          <div className={styles.compassRose} aria-hidden="true">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(201,168,76,0.08)"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                stroke="rgba(201,168,76,0.06)"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="30"
                stroke="rgba(201,168,76,0.1)"
                strokeWidth="1"
              />
              <line
                x1="100"
                y1="8"
                x2="100"
                y2="192"
                stroke="rgba(201,168,76,0.08)"
                strokeWidth="1"
              />
              <line
                x1="8"
                y1="100"
                x2="192"
                y2="100"
                stroke="rgba(201,168,76,0.08)"
                strokeWidth="1"
              />
              <line
                x1="26"
                y1="26"
                x2="174"
                y2="174"
                stroke="rgba(201,168,76,0.05)"
                strokeWidth="1"
              />
              <line
                x1="174"
                y1="26"
                x2="26"
                y2="174"
                stroke="rgba(201,168,76,0.05)"
                strokeWidth="1"
              />
              <polygon
                points="100,10 107,90 100,100 93,90"
                fill="rgba(201,168,76,0.5)"
              />
              <polygon
                points="100,190 107,110 100,100 93,110"
                fill="rgba(201,168,76,0.15)"
              />
              <polygon
                points="190,100 110,107 100,100 110,93"
                fill="rgba(201,168,76,0.15)"
              />
              <polygon
                points="10,100 90,107 100,100 90,93"
                fill="rgba(201,168,76,0.15)"
              />
              <circle cx="100" cy="100" r="5" fill="rgba(201,168,76,0.6)" />
            </svg>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag}>The Process</div>
            <h2 className={styles.sectionTitle}>
              Not a quiz. A conversation.
            </h2>
            <p className={styles.sectionSub}>
              Compass doesn&apos;t assign you to a box. It listens, probes,
              and uncovers what you might not even know about yourself.
            </p>

            <div className={styles.stepsGrid}>
              {HOW_IT_WORKS.map((step, i) => (
                <div
                  key={i}
                  className={styles.stepCard}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className={styles.stepNumber}>{step.number}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREVIEW */}
        <section className={styles.previewSection}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag}>Sample Questions</div>
            <h2 className={styles.sectionTitle}>
              Questions that actually matter
            </h2>
            <div className={styles.questionsGrid}>
              {[
                "Think back to a time when you were so absorbed in something that hours felt like minutes. What were you doing?",
                "If you could design your Tuesday — the whole day — what would it look like?",
                "What kind of legacy do you want to leave behind — and for who?",
                "When someone praises you, what do you secretly hope they noticed?",
                "What would you do if you knew you couldn't fail — and no one was watching?",
                "Describe a moment when you felt genuinely proud of yourself.",
              ].map((q, i) => (
                <div key={i} className={styles.questionCard}>
                  <div className={styles.questionIcon}>◈</div>
                  <p className={styles.questionText}>&ldquo;{q}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTS PREVIEW */}
        <section className={styles.resultsPreview}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag}>What You Get</div>
            <h2 className={styles.sectionTitle}>Your complete career map</h2>
            <div className={styles.resultsGrid}>
              {[
                {
                  icon: "◈",
                  title: "Primary Career Match",
                  desc: "Your #1 career recommendation with a personalised fit score and the exact steps to begin.",
                  accent: "gold",
                },
                {
                  icon: "⬡",
                  title: "3 Alternative Paths",
                  desc: "Backup directions that align with your values, each with honest fit percentages.",
                  accent: "blue",
                },
                {
                  icon: "◇",
                  title: "Core Strengths",
                  desc: "The 4 traits that define you — and how each one gives you an edge.",
                  accent: "green",
                },
                {
                  icon: "△",
                  title: "Deep Dive Mode",
                  desc: "Tap any career for income ranges, day-in-the-life, timeline, and resources to start today.",
                  accent: "orange",
                },
              ].map((item, i) => (
                <div key={i} className={`${styles.resultCard} ${styles[`resultCard_${item.accent}`]}`}>
                  <div className={`${styles.resultIcon} ${styles[`resultIcon_${item.accent}`]}`}>
                    {item.icon}
                  </div>
                  <h3 className={styles.resultTitle}>{item.title}</h3>
                  <p className={styles.resultDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className={styles.testimonialsSection}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag}>Stories</div>
            <h2 className={styles.sectionTitle}>Lives redirected</h2>

            <div className={styles.testimonialStage}>
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className={`${styles.testimonialCard} ${i === activeTestimonial ? styles.testimonialActive : ""}`}
                >
                  <div className={styles.testimonialQuoteIcon}>&ldquo;</div>
                  <p className={styles.testimonialQuote}>{t.quote}</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.testimonialAvatar}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div className={styles.testimonialName}>{t.name}</div>
                      <div className={styles.testimonialRole}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.testimonialDots}>
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`${styles.testimonialDot} ${i === activeTestimonial ? styles.testimonialDotActive : ""}`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaSectionInner}>
            <div className={styles.ctaSectionCompass} aria-hidden="true">
              ◈
            </div>
            <h2 className={styles.ctaSectionTitle}>
              Your direction is waiting.
            </h2>
            <p className={styles.ctaSectionSub}>
              Ten minutes. One honest conversation.
              <br />A lifetime of clarity.
            </p>
            <Link href="/compass" className={styles.ctaPrimary}>
              Begin My Journey
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <p className={styles.ctaSectionNote}>
              Free · No account required · Private
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◈</span>
              <span className={styles.logoText}>Compass</span>
            </div>
            <p className={styles.footerNote}>
              Built to help people find their way.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
