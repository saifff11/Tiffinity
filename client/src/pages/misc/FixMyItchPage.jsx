import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  Flame,
  ExternalLink,
  Github,
} from "lucide-react";
import Footer from "../../components/Footer";
import MiscNavbar from "../../components/MiscNavbar";

// ── Reusable section label ──
function SectionLabel({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 14px",
        background: "var(--secondary-fixed)",
        color: "var(--on-secondary-fixed)",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderRadius: "6px",
        marginBottom: "18px",
      }}>
      {children}
    </span>
  );
}

// ── Screenshot frame with browser chrome ──
function ScreenshotFrame({ src, alt, caption, highlight }) {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: highlight
            ? "2.5px solid var(--primary)"
            : "1.5px solid var(--outline-variant)",
          boxShadow: highlight
            ? "0 0 0 6px var(--primary-fixed)"
            : "0 4px 24px rgba(0,0,0,0.08)",
        }}>
        {/* Browser chrome */}
        <div
          style={{
            background: "var(--surface-container-low)",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: "1px solid var(--outline-variant)",
          }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <div
                key={c}
                style={{
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              background: "var(--surface-container)",
              borderRadius: "6px",
              padding: "4px 12px",
              fontSize: "0.72rem",
              color: "var(--on-surface-variant)",
              marginLeft: "8px",
            }}>
            {alt}
          </div>
        </div>
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", display: "block", objectFit: "cover" }}
        />
      </div>
      {caption && (
        <p
          style={{
            marginTop: "12px",
            fontSize: "0.8rem",
            color: "var(--on-surface-variant)",
            textAlign: "center",
            fontStyle: "italic",
          }}>
          {caption}
        </p>
      )}
    </div>
  );
}

// ── Connector arrow ──
function Connector() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <ArrowDown size={28} style={{ color: "var(--primary)", opacity: 0.45 }} />
    </div>
  );
}

function FixMyItchPage() {
  const navigate = useNavigate();

  return (
    <div>
      <MiscNavbar activeItem='home' />
      <div className='dashboard-wrap bg-background'>
        <main>
          {/* ═══════════════════════════════════════
              SECTION 1 — What is Fix My Itch?
          ═══════════════════════════════════════ */}
          <section
            style={{
              padding:
                "clamp(56px, 10vw, 100px) clamp(16px, 4vw, 40px) clamp(40px, 6vw, 64px)",
            }}>
            <div className='dashboard-content max-w-5xl mx-auto'>
              <SectionLabel>
                <Flame size={12} /> Step 01 · Where It Started
              </SectionLabel>

              <h1
                className='auth-right-headline'
                style={{
                  color: "var(--on-surface)",
                  fontSize: "clamp(2rem, 6vw, 3.2rem)",
                  lineHeight: 1.06,
                  marginBottom: "20px",
                  maxWidth: "700px",
                }}>
                Razorpay launched <br />
                <span style={{ color: "var(--primary)" }}>Fix My Itch</span>
                <span>
                  <a
                    href='https://razorpay.com/m/fix-my-itch/'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px",
                    }}>
                    <ExternalLink size={15} />
                  </a>
                </span>
              </h1>

              <p
                className='auth-page-sub'
                style={{
                  fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                  maxWidth: "620px",
                  marginBottom: "40px",
                }}>
                Fix My Itch is Razorpay's open problem registry — a curated list
                of real, unsolved problems across industries in India, each
                scored by severity, market size, whitespace, and frequency. It's
                built for founders and builders who want to work on problems
                that actually matter.
              </p>

              <ScreenshotFrame
                src='https://res.cloudinary.com/dipcaws84/image/upload/v1775458753/Screenshot_836_xgz1wg.png'
                alt='razorpay.com/m/fix-my-itch/'
                caption='Razorpay Fix My Itch — the home page'
              />

              {/* Start Building Now — bottom section of Fix My Itch */}
              <div style={{ marginTop: "48px" }}>
                <ScreenshotFrame
                  src='https://res.cloudinary.com/dipcaws84/image/upload/v1775459971/Screenshot_842_yr43yx.png'
                  alt='razorpay.com/m/fix-my-itch/#mission'
                  caption='"Start Building Now" — Razorpay'
                />
              </div>
            </div>
            {/* Razorpay link */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
              }}>
              <a
                href='https://razorpay.com/m/fix-my-itch/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "var(--surface-container-low)",
                  border: "1.5px solid var(--outline-variant)",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--primary-fixed)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "var(--surface-container-low)")
                }>
                <ExternalLink size={15} />
                Explore Fix My Itch yourself
              </a>
            </div>
          </section>

          <Connector />

          {/* ═══════════════════════════════════════
              SECTION 2 — The Problem List
          ═══════════════════════════════════════ */}
          <section
            style={{
              padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 40px)",
              background: "var(--surface-container-low)",
            }}>
            <div className='dashboard-content max-w-5xl mx-auto'>
              <SectionLabel>Step 02 · The List</SectionLabel>

              <h2
                className='auth-right-headline'
                style={{
                  fontSize: "clamp(1.7rem, 5vw, 2.6rem)",
                  color: "var(--on-surface)",
                  marginBottom: "16px",
                  maxWidth: "640px",
                }}>
                Hundreds of problems. Ranked by how much they hurt.
              </h2>

              <p
                className='auth-page-sub'
                style={{
                  fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                  maxWidth: "580px",
                  marginBottom: "32px",
                }}>
                Every problem is scored across four dimensions — Severity, TAM
                (total addressable market), Whitespace (how underserved the
                space is), and Frequency. Together they produce the Itch Score.
                The higher the score, the more urgently it needs to be built.
              </p>

              {/* Score legend */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "36px",
                }}>
                {[
                  { label: "Severity", desc: "How painful is it?" },
                  { label: "TAM Score", desc: "How big is the market?" },
                  { label: "Whitespace", desc: "How underserved?" },
                  { label: "Frequency", desc: "How often does it happen?" },
                ].map(({ label, desc }) => (
                  <div
                    key={label}
                    className='stat-card'
                    style={{
                      padding: "10px 16px",
                      background: "var(--surface-container-lowest)",
                      flex: "1 1 140px",
                    }}>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                        display: "block",
                      }}>
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--on-surface-variant)",
                      }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>

              <ScreenshotFrame
                src='https://res.cloudinary.com/dipcaws84/image/upload/v1775458730/Screenshot_837_alzcsy.png'
                alt='fix-my-itch/#all-problems'
                caption='The full problem list, sorted by Itch Score'
              />
            </div>
          </section>

          <Connector />

          {/* ═══════════════════════════════════════
              SECTION 3 — The Chosen Problem
          ═══════════════════════════════════════ */}
          <section
            style={{
              padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 40px)",
            }}>
            <div className='dashboard-content max-w-5xl mx-auto'>
              <SectionLabel>
                <Flame size={12} /> Step 03 · The Problem We Picked
              </SectionLabel>

              <h2
                className='auth-right-headline'
                style={{
                  fontSize: "clamp(1.7rem, 5vw, 2.6rem)",
                  color: "var(--on-surface)",
                  marginBottom: "16px",
                  maxWidth: "700px",
                }}>
                One problem stopped us —{" "}
                <span style={{ color: "var(--primary)" }}>Itch Score 74.5</span>
              </h2>

              <p
                className='auth-page-sub'
                style={{
                  fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                  maxWidth: "600px",
                  marginBottom: "24px",
                }}>
                Out of all the problems listed, this one hit hardest. A TAM
                score of 10/10 with a Whitespace score of 8.5 — a massive market
                with almost no one solving it right.
              </p>

              {/* Pull quote */}
              <div
                style={{
                  borderLeft: "4px solid var(--primary)",
                  paddingLeft: "20px",
                  margin: "28px 0 32px",
                }}>
                <p
                  className='auth-page-title'
                  style={{
                    fontSize: "clamp(1rem, 3vw, 1.15rem)",
                    lineHeight: 1.55,
                    color: "var(--on-surface)",
                    fontStyle: "italic",
                    margin: 0,
                  }}>
                  "Professionals subscribing to tiffin services receive
                  pre-decided daily menus with no customization options.
                  Customers endure dishes they dislike 2–3 times weekly but
                  cannot switch. No tiffin service allows day-to-day menu
                  selection while maintaining subscription economics."
                </p>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "0.78rem",
                    color: "var(--on-surface-variant)",
                    fontWeight: 600,
                  }}>
                  — Razorpay Fix My Itch · Food & Beverage · Severity 7
                </p>
              </div>

              {/* Score pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "40px",
                }}>
                {[
                  { label: "Itch Score", value: "74.5", accent: true },
                  { label: "TAM Score", value: "10 / 10" },
                  { label: "Whitespace", value: "8.5 / 10" },
                  { label: "Frequency", value: "6 / 10" },
                  { label: "Severity", value: "7 / 10" },
                ].map(({ label, value, accent }) => (
                  <div
                    key={label}
                    style={{
                      padding: "14px 20px",
                      borderRadius: "14px",
                      background: accent
                        ? "var(--primary)"
                        : "var(--surface-container-low)",
                      flex: "1 1 100px",
                      textAlign: "center",
                    }}>
                    <div
                      style={{
                        fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                        fontWeight: 700,
                        color: accent ? "#fff" : "var(--primary)",
                        lineHeight: 1,
                      }}>
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: accent
                          ? "rgba(255,255,255,0.75)"
                          : "var(--on-surface-variant)",
                        marginTop: "6px",
                      }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <ScreenshotFrame
                src='https://res.cloudinary.com/dipcaws84/image/upload/v1775458668/Screenshot_2026-04-06_122557_jwr3cj.png'
                alt='fix-my-itch/#all-problems'
                caption='The exact problem card highlighted on Fix My Itch'
                highlight
              />
            </div>
          </section>

          <Connector />

          {/* ═══════════════════════════════════════
              SECTION 4 — The Solution: TiffinBox
          ═══════════════════════════════════════ */}
          <section
            style={{
              padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 40px)",
              background: "var(--surface-container-low)",
            }}>
            <div className='dashboard-content max-w-5xl mx-auto'>
              <SectionLabel>Step 04 · The Solution</SectionLabel>

              <h2
                className='auth-right-headline'
                style={{
                  fontSize: "clamp(1.7rem, 5vw, 2.6rem)",
                  color: "var(--on-surface)",
                  marginBottom: "16px",
                  maxWidth: "680px",
                }}>
                We already built the answer.{" "}
                <span style={{ color: "var(--primary)" }}>Meet TiffinBox.</span>
              </h2>

              <p
                className='auth-page-sub'
                style={{
                  fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                  maxWidth: "560px",
                  marginBottom: "32px",
                }}>
                A city-based pre-order platform where home cooks post their
                daily menu every morning and nearby customers pick exactly what
                they want — before it's even cooked.
              </p>

              {/* Problem → Fix mapping */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "12px",
                  marginBottom: "40px",
                }}>
                {[
                  {
                    problem: "No daily menu choice",
                    solution:
                      "Browse & order from today's fresh menu every morning",
                  },
                  {
                    problem: "No trust in who's cooking your food",
                    solution:
                      "Every cook goes through admin verification before going live on the platform",
                  },
                  {
                    problem: "Allergies & preferences ignored",
                    solution: "Pick cooks by cuisine, dish, and ingredients",
                  },

                  {
                    problem: "No way to know if a cook is reliable",
                    solution:
                      "Verified ratings & reviews — only customers with delivered orders can rate",
                  },
                ].map(({ problem, solution }) => (
                  <div
                    key={problem}
                    className='stat-card'
                    style={{
                      background: "var(--surface-container-lowest)",
                      padding: "16px 18px",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        marginBottom: "10px",
                      }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#fff",
                          background: "var(--error)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}>
                        Problem
                      </span>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--on-surface-variant)",
                          margin: 0,
                          lineHeight: 1.4,
                        }}>
                        {problem}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#fff",
                          background: "var(--primary)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}>
                        Fix
                      </span>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--on-surface)",
                          margin: 0,
                          lineHeight: 1.4,
                          fontWeight: 500,
                        }}>
                        {solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <ScreenshotFrame
                src='https://res.cloudinary.com/dipcaws84/image/upload/v1775467620/Screenshot_843_q0ict7.png'
                alt='tiffinbox — landing page'
                caption='TiffinBox landing page — live and deployed'
                highlight
              />
            </div>
          </section>

          <Connector />

          {/* ═══════════════════════════════════════
              SECTION 5 — UI Screenshots + CTA
          ═══════════════════════════════════════ */}
          <section
            style={{
              padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 40px)",
            }}>
            <div className='dashboard-content max-w-5xl mx-auto'>
              <SectionLabel>Step 05 · Try It</SectionLabel>

              <h2
                className='auth-right-headline'
                style={{
                  fontSize: "clamp(1.7rem, 5vw, 2.4rem)",
                  color: "var(--on-surface)",
                  marginBottom: "12px",
                }}>
                Built, designed, and shipped.
              </h2>
              <a
                href='https://github.com/shubham99k/tiffinbox'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 24px",
                  background: "var(--on-surface)",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  borderRadius: "10px",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "20px",
                }}>
                <Github size={16} /> Source Code
              </a>
              <p
                className='auth-page-sub'
                style={{
                  fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                  maxWidth: "520px",
                  marginBottom: "40px",
                }}>
                Join as a customer to pick your daily meals, or register as a
                home cook to start your own tiffin service.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                  marginBottom: "48px",
                }}>
                <ScreenshotFrame
                  src='https://res.cloudinary.com/dipcaws84/image/upload/v1775458853/Screenshot_841_m7zjyf.png'
                  alt='TiffinBox — Sign Up'
                  caption='Sign up as a customer or cook'
                />
                <ScreenshotFrame
                  src='https://res.cloudinary.com/dipcaws84/image/upload/v1775458868/Screenshot_840_voimye.png'
                  alt='TiffinBox — Login'
                  caption='Log back in anytime'
                />
              </div>

              {/* Final CTA */}
              <div
                style={{
                  background: "var(--primary-fixed)",
                  borderRadius: "24px",
                  padding: "clamp(28px, 5vw, 52px)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                }}>
                <div>
                  <h3
                    className='auth-page-title'
                    style={{
                      fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                      color: "var(--primary-container)",
                      marginBottom: "8px",
                    }}>
                    The problem is real. The solution is live.
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--on-surface-variant)",
                      margin: 0,
                      maxWidth: "400px",
                    }}>
                    Join TiffinBox and never eat something you didn't choose
                    again.
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <button
                    onClick={() => navigate("/register")}
                    className='auth-btn'
                    style={{ padding: "14px 24px" }}>
                    Get Started Free
                  </button>

                  <button
                    onClick={() => navigate("/how-it-works")}
                    className='auth-back'
                    style={{
                      marginLeft: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}>
                    How it works <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default FixMyItchPage;
