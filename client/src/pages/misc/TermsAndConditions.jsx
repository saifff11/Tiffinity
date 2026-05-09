import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import MiscNavbar from "../../components/MiscNavbar";

const sections = [
  { id: "definitions", icon: "description", label: "Definitions" },
  { id: "obligations", icon: "person_check", label: "User Obligations" },
  { id: "payments", icon: "payments", label: "Payments" },
  { id: "cancellations", icon: "event_busy", label: "Cancellations" },
  { id: "liability", icon: "security", label: "Limitation of Liability" },
];

function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("definitions");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* ── NAVBAR ── */}
      {/* ── Top Navigation Bar ── */}
      <MiscNavbar />
      <div
        style={{
          background: "var(--surface)",
          minHeight: "100vh",
          color: "var(--on-surface)",
          overflowX: isMobile ? "hidden" : "visible",
        }}>
        {/* ── MAIN ── */}
        <main
          style={{
            paddingTop: isMobile ? "88px" : "112px",
            paddingBottom: isMobile ? "64px" : "80px",
            boxSizing: "border-box",
            width: "100%",
            overflowX: isMobile ? "hidden" : "visible",
          }}>
          <div
            style={{
              maxWidth: "1100px",
              width: "100%",
              margin: "0 auto",
              padding: isMobile ? "0 16px" : "0 clamp(16px, 4vw, 40px)",
              overflowX: isMobile ? "hidden" : "visible",
              boxSizing: "border-box",
            }}>
            {/* ── HEADER ── */}
            <header
              style={{
                marginBottom: isMobile ? "40px" : "64px",
                paddingBottom: isMobile ? "24px" : "48px",
                borderBottom: "1px solid var(--surface-container-high)",
                textAlign: "left",
              }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 14px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--primary-fixed)",
                  color: "var(--primary-container)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "16px",
                  marginTop: isMobile ? "8px" : "16px",
                }}>
                <span
                  className='material-symbols-outlined'
                  style={{ fontSize: "14px" }}>
                  gavel
                </span>
                Transparency in T&C
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isMobile ? "2rem" : "clamp(2.5rem, 6vw, 3.5rem)",
                    fontWeight: 900,
                    color: "var(--primary-container)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}>
                  Terms and Conditions
                </h1>
              </div>
              <p
                style={{
                  color: "var(--on-surface-variant)",
                  fontSize: isMobile ? "0.9375rem" : "1rem",
                  lineHeight: 1.75,
                  maxWidth: "600px",
                  margin: isMobile ? "0 auto" : 0,
                }}>
                Last Updated: April 01, 2026. These terms govern your use of
                TiffinBox's platform and services. Please read them carefully.
              </p>
            </header>

            {/* ── GRID ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr",
                gap: isMobile ? "24px" : "48px",
                alignItems: "start",
              }}>
              {/* ── SIDEBAR ── */}
              {!isMobile && (
                <aside
                  style={{
                    position: "sticky",
                    top: "96px",
                  }}>
                  <div
                    style={{
                      position: "sticky",
                      top: "96px",
                    }}>
                    <p
                      className='inp-label'
                      style={{
                        marginBottom: "16px",
                        paddingLeft: "16px",
                      }}>
                      Sections
                    </p>

                    <nav
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        overflowX: "visible",
                        paddingBottom: 0,
                      }}>
                      {sections.map(({ id, icon, label }) => {
                        const isActive = activeSection === id;
                        return (
                          <button
                            key={id}
                            onClick={() => handleNavClick(id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "12px 16px",
                              borderRadius: "var(--radius-lg)",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "var(--font-body)",
                              fontSize: "0.875rem",
                              fontWeight: isActive ? 700 : 500,
                              textAlign: "left",
                              whiteSpace: "normal",
                              flexShrink: 1,
                              transition: "all 0.2s",
                              color: isActive
                                ? "var(--primary-container)"
                                : "var(--on-surface-variant)",
                              background: isActive
                                ? "var(--primary-fixed)"
                                : "transparent",
                              borderLeft: isActive
                                ? "3px solid var(--primary)"
                                : "3px solid transparent",
                            }}>
                            <span
                              className='material-symbols-outlined'
                              style={{ fontSize: "18px" }}>
                              {icon}
                            </span>
                            {label}
                          </button>
                        );
                      })}
                    </nav>

                    {/* Help card */}
                    <div
                      style={{
                        marginTop: "32px",
                        padding: "24px",
                        borderRadius: "var(--radius-lg)",
                        background: "var(--primary-fixed-dim)",
                        color: "var(--primary-container)",
                        position: "relative",
                        overflow: "hidden",
                      }}>
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "0.9375rem",
                            marginBottom: "8px",
                          }}>
                          Questions about Terms?
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            lineHeight: 1.65,
                            opacity: 0.85,
                          }}>
                          Our legal team is available to explain any of these
                          terms in plain English.
                        </p>
                        <button
                          style={{
                            marginTop: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            color: "var(--primary-container)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontFamily: "var(--font-display)",
                          }}>
                          Learn more
                          <span
                            className='material-symbols-outlined'
                            style={{ fontSize: "16px" }}>
                            arrow_forward
                          </span>
                        </button>
                      </div>
                      {/* decorative bg icon */}
                      <span
                        className='material-symbols-outlined'
                        style={{
                          position: "absolute",
                          right: "-12px",
                          bottom: "-12px",
                          fontSize: "80px",
                          opacity: 0.1,
                          pointerEvents: "none",
                        }}>
                        gavel
                      </span>
                    </div>
                  </div>
                </aside>
              )}

              {/* ── DOCUMENT BODY ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? "40px" : "64px",
                  minWidth: 0,
                }}>
                {isMobile && (
                  <nav
                    aria-label='Terms sections'
                    style={{
                      display: "flex",
                      gap: "8px",
                      overflowX: "auto",
                      paddingBottom: "6px",
                      maxWidth: "100%",
                    }}>
                    {sections.map(({ id, label }) => {
                      const isActive = activeSection === id;
                      return (
                        <button
                          key={id}
                          onClick={() => handleNavClick(id)}
                          style={{
                            whiteSpace: "nowrap",
                            borderRadius: "999px",
                            padding: "8px 12px",
                            border: isActive
                              ? "1px solid var(--primary)"
                              : "1px solid var(--outline-variant)",
                            background: isActive
                              ? "var(--primary-fixed)"
                              : "var(--surface-container-lowest)",
                            color: isActive
                              ? "var(--primary-container)"
                              : "var(--on-surface-variant)",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}>
                          {label}
                        </button>
                      );
                    })}
                  </nav>
                )}

                {/* 1. Definitions */}
                <section id='definitions' style={{ scrollMarginTop: "96px" }}>
                  <SectionHeading
                    icon='description'
                    number='1.'
                    title='Definitions'
                    isMobile={isMobile}
                  />
                  <div
                    className='table-card'
                    style={{
                      padding: isMobile ? "20px" : "32px",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      overflowX: "hidden",
                    }}>
                    <p
                      style={{
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.75,
                        marginBottom: "24px",
                        fontSize: "0.9375rem",
                      }}>
                      In these Terms and Conditions, the following words have
                      specific meanings:
                    </p>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        listStyle: "none",
                        padding: 0,
                      }}>
                      {[
                        {
                          term: '"Company"',
                          def: "Refers to TiffinBox, its subsidiaries, and affiliates.",
                        },
                        {
                          term: '"Service"',
                          def: "Refers to the platform, website, and digital products provided by the Company.",
                        },
                        {
                          term: '"User"',
                          def: "Any individual or entity who accesses or uses the Service.",
                        },
                      ].map(({ term, def }) => (
                        <li
                          key={term}
                          style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: isMobile ? "8px" : "20px",
                            alignItems: "flex-start",
                          }}>
                          <strong
                            style={{
                              minWidth: isMobile ? "0" : "110px",
                              color: "var(--primary-container)",
                              fontFamily: "var(--font-display)",
                              fontWeight: 800,
                              fontSize: "0.875rem",
                              flexShrink: 0,
                              paddingTop: "1px",
                            }}>
                            {term}
                          </strong>
                          <span
                            style={{
                              color: "var(--on-surface-variant)",
                              fontSize: "0.9375rem",
                              lineHeight: 1.65,
                            }}>
                            {def}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* 2. User Obligations */}
                <section id='obligations' style={{ scrollMarginTop: "96px" }}>
                  <SectionHeading
                    icon='person_check'
                    number='2.'
                    title='User Obligations'
                    isMobile={isMobile}
                  />
                  <p
                    style={{
                      color: "var(--on-surface-variant)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.75,
                      marginBottom: "20px",
                    }}>
                    By using the Service, you agree to:
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "16px",
                    }}>
                    {[
                      {
                        title: "Account Security",
                        body: "Maintain the confidentiality of your account credentials and notify us immediately of any breach.",
                      },
                      {
                        title: "Lawful Use",
                        body: "Use the service only for lawful purposes and in accordance with all local and international laws.",
                      },
                      {
                        title: "Content Integrity",
                        body: "Ensure all information provided is accurate, current, and does not infringe on third-party rights.",
                      },
                      {
                        title: "Prohibited Conduct",
                        body: "Refrain from any activities that could damage, disable, or overburden the digital infrastructure.",
                      },
                    ].map(({ title, body }) => (
                      <div
                        key={title}
                        style={{
                          padding: "20px 22px",
                          background: "var(--surface-container-lowest)",
                          borderRadius: "var(--radius-lg)",
                          borderTop: "3px solid var(--primary-fixed-dim)",
                          boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                        }}>
                        <h4
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            color: "var(--primary-container)",
                            marginBottom: "8px",
                            fontSize: "0.9rem",
                          }}>
                          {title}
                        </h4>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--on-surface-variant)",
                            lineHeight: 1.65,
                          }}>
                          {body}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Payments */}
                <section id='payments' style={{ scrollMarginTop: "96px" }}>
                  <SectionHeading
                    icon='payments'
                    number='3.'
                    title='Payments'
                    isMobile={isMobile}
                  />
                  {/* Left accent bar card — per DESIGN.md: 4px vertical bar instead of lines */}
                  <div
                    style={{
                      background: "var(--surface-container-lowest)",
                      borderLeft: "4px solid var(--primary)",
                      borderRadius: "0 var(--radius-lg) var(--radius-lg) 0",
                      padding: isMobile ? "20px" : "32px",
                      boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}>
                    <p
                      style={{
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.75,
                        fontSize: "0.9375rem",
                        marginBottom: "24px",
                      }}>
                      Access to certain features of the Service requires the
                      payment of fees. You agree to pay all fees in accordance
                      with the pricing and payment terms presented to you at the
                      time of purchase.
                    </p>
                    {/* Info callout */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        padding: isMobile ? "14px" : "20px",
                        background: "var(--surface-container-low)",
                        borderRadius: "var(--radius-lg)",
                      }}>
                      <span
                        className='material-symbols-outlined'
                        style={{
                          fontSize: "22px",
                          color: "var(--primary)",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}>
                        verified
                      </span>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            color: "var(--on-surface)",
                            marginBottom: "4px",
                            fontSize: "0.9375rem",
                          }}>
                          Automatic Renewals
                        </p>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--on-surface-variant)",
                            lineHeight: 1.65,
                          }}>
                          Subscriptions auto-renew at the end of each billing
                          cycle unless cancelled at least 24 hours prior.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Cancellations */}
                <section id='cancellations' style={{ scrollMarginTop: "96px" }}>
                  <SectionHeading
                    icon='event_busy'
                    number='4.'
                    title='Cancellations'
                    isMobile={isMobile}
                  />
                  <div
                    className='table-card'
                    style={{
                      padding: isMobile ? "20px" : "32px",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      overflowX: "hidden",
                    }}>
                    <p
                      style={{
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.75,
                        fontSize: "0.9375rem",
                        marginBottom: "28px",
                      }}>
                      Users may cancel their subscriptions at any time via the
                      Account Settings dashboard. Upon cancellation, access to
                      premium features will continue until the end of the
                      current billing period.
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: "16px",
                      }}>
                      <div
                        style={{
                          padding: "24px",
                          background: "var(--surface-container-lowest)",
                          borderRadius: "var(--radius-lg)",
                          borderTop: "3px solid var(--error)",
                          boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                        }}>
                        <h4
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            color: "var(--error)",
                            marginBottom: "8px",
                            fontSize: "0.9rem",
                          }}>
                          Refund Policy
                        </h4>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--on-surface-variant)",
                            lineHeight: 1.65,
                          }}>
                          Refunds are granted on a case-by-case basis and only
                          within the first 7 days of the initial purchase.
                        </p>
                      </div>
                      <div
                        style={{
                          padding: "24px",
                          background: "var(--surface-container-lowest)",
                          borderRadius: "var(--radius-lg)",
                          borderTop: "3px solid var(--surface-container-high)",
                          boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                        }}>
                        <h4
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            color: "var(--on-surface)",
                            marginBottom: "8px",
                            fontSize: "0.9rem",
                          }}>
                          Termination
                        </h4>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--on-surface-variant)",
                            lineHeight: 1.65,
                          }}>
                          The Company reserves the right to terminate accounts
                          that violate these Terms without prior notice.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. Limitation of Liability */}
                <section id='liability' style={{ scrollMarginTop: "96px" }}>
                  <SectionHeading
                    icon='security'
                    number='5.'
                    title='Limitation of Liability'
                    isMobile={isMobile}
                  />
                  {/* Dark disclaimer block */}
                  <div
                    style={{
                      background: "var(--on-surface)",
                      color: "var(--surface)",
                      padding: isMobile ? "24px" : "40px",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "0 8px 32px rgba(20,27,43,0.18)",
                    }}>
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                        opacity: 0.55,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "20px",
                      }}>
                      Legal Disclaimer
                    </p>
                    <p
                      style={{
                        lineHeight: 1.8,
                        fontStyle: "italic",
                        marginBottom: "20px",
                        fontSize: "0.9375rem",
                        opacity: 0.88,
                      }}>
                      TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
                      TIFFINBOX SHALL NOT BE LIABLE FOR ANY INDIRECT,
                      INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                      OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
                      DIRECTLY OR INDIRECTLY.
                    </p>
                    <p
                      style={{
                        lineHeight: 1.8,
                        fontSize: "0.9375rem",
                        opacity: 0.75,
                      }}>
                      Our total liability for any claim arising out of these
                      terms shall not exceed the amount paid by you to the
                      Company in the twelve months preceding the event giving
                      rise to the claim.
                    </p>
                  </div>
                </section>

                {/* ── CONTACT CTA ── */}
                <div
                  style={{
                    background: "var(--surface-container-high)",
                    padding: isMobile ? "24px" : "40px",
                    borderRadius: "var(--radius-lg)",
                    textAlign: "center",
                    borderTop: "4px solid var(--primary)",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                  }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "var(--on-surface)",
                      letterSpacing: "-0.02em",
                      marginBottom: "10px",
                    }}>
                    Questions about our Terms?
                  </h3>
                  <p
                    style={{
                      color: "var(--on-surface-variant)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.65,
                      marginBottom: "28px",
                    }}>
                    Our legal team is here to help you understand your rights
                    and obligations.
                  </p>
                  <a
                    href='mailto:legal@tiffinbox.in'
                    className='auth-btn'
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: isMobile ? "100%" : "auto",
                      maxWidth: "100%",
                      padding: "12px 32px",
                      margin: 0,
                      boxSizing: "border-box",
                      textDecoration: "none",
                      fontSize: "0.9375rem",
                    }}>
                    <span
                      className='material-symbols-outlined'
                      style={{ fontSize: "18px" }}>
                      mail
                    </span>
                    Contact Legal Team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <Footer />
      </div>
    </div>
  );
}

/* ── Section heading with icon badge ── */
function SectionHeading({ icon, number, title, isMobile = false }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: isMobile ? "1.25rem" : "1.5rem",
        fontWeight: 900,
        color: "var(--on-surface)",
        letterSpacing: "-0.02em",
        display: "flex",
        alignItems: "center",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: isMobile ? "10px" : "12px",
        marginBottom: isMobile ? "16px" : "24px",
        minWidth: 0,
      }}>
      {/* Icon badge */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "32px" : "36px",
          height: isMobile ? "32px" : "36px",
          background: "var(--primary)",
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
        }}>
        <span
          className='material-symbols-outlined'
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: "var(--primary-fixed)",
          }}>
          {icon}
        </span>
      </span>
      <span
        style={{
          color: "var(--on-surface-variant)",
          fontWeight: 400,
          marginRight: "4px",
        }}>
        {number}
      </span>
      <span
        style={{
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          minWidth: 0,
        }}>
        {title}
      </span>
    </h2>
  );
}

export default TermsAndConditions;
