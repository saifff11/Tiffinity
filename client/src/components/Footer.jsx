import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const footerLinks = [
  { label: "Privacy Policy", path: "/policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "How it works", path: "/how-it-works" },
  // { label: "Help Center", path: "/help-center" },
  { label: "Why we built this", path: "/fix-my-itch" },
];

// Scroll to top whenever the route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const Footer = () => {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <footer
        style={{
          marginTop: "25vh",
          borderTop: "1px solid var(--surface-container-high)",
          background: "var(--surface-container-low)",
          padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 40px)",
        }}>
        <div
          // className='flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-6 sm:gap-8'
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "clamp(16px, 4vw, 24px)",
          }}>
          <div>
            <p
              className='text-base sm:text-lg'
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "var(--primary-container)",
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                marginBottom: "4px",
              }}>
              TiffinBox
            </p>
            <p
              className='text-xs sm:text-sm'
              style={{
                fontSize: "clamp(0.75rem, 1.5vw, 0.8125rem)",
                color: "var(--on-surface-variant)",
              }}>
              © 2026 TiffinBox. All rights reserved.
            </p>
          </div>

          <div
            className='flex flex-wrap gap-4 sm:gap-6'
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(12px, 3vw, 24px)",
            }}>
            {footerLinks.map(({ label, path }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  target='_blank'
                  className='text-xs sm:text-sm'
                  style={{
                    fontSize: "clamp(0.75rem, 1.5vw, 0.8125rem)",
                    fontFamily: "var(--font-body)",
                    fontWeight: isActive ? 700 : 400,
                    color: isActive
                      ? "var(--primary)"
                      : "var(--on-surface-variant)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive
                      ? "var(--primary)"
                      : "var(--on-surface-variant)")
                  }>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

// import { Link, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// // ── Link columns ──────────────────────────────────────
// const columns = [
//   {
//     heading: "Product",
//     links: [
//       { label: "How it Works",  path: "/how-it-works" },
//       { label: "Marketplace",   path: "/marketplace" },
//       { label: "For Cooks",     path: "/for-cooks" },
//       { label: "Pricing",       path: "/pricing" },
//       { label: "Blog",          path: "/blog" },
//     ],
//   },
//   {
//     heading: "Company",
//     links: [
//       { label: "About",    path: "/about" },
//       { label: "Careers",  path: "/careers" },
//       { label: "Press",    path: "/press" },
//       { label: "Contact",  path: "/contact" },
//       { label: "Sitemap",  path: "/sitemap" },
//     ],
//   },
//   {
//     heading: "Support",
//     links: [
//       { label: "Help Center",   path: "/help-center" },
//       { label: "Support",       path: "/support" },
//       { label: "Accessibility", path: "/accessibility" },
//       { label: "Security",      path: "/security" },
//       { label: "Status",        path: "/status" },
//     ],
//   },
//   {
//     heading: "Legal",
//     links: [
//       { label: "Privacy Policy",     path: "/policy" },
//       { label: "Terms & Conditions", path: "/terms-and-conditions" },
//       { label: "Cookie Policy",      path: "/cookie-policy" },
//       { label: "Legal",              path: "/legal" },
//       { label: "Licenses",           path: "/licenses" },
//     ],
//   },
// ];

// const socialLinks = [
//   { icon: "language",   label: "Website", href: "#" },
//   { icon: "mail",       label: "Email",   href: "mailto:hello@tiffinbox.in" },
//   { icon: "smartphone", label: "App",     href: "#" },
// ];

// const stats = [
//   { num: "2K+",  label: "Home Cooks" },
//   { num: "50K+", label: "Meals Served" },
//   { num: "4.8★", label: "Avg Rating" },
//   { num: "12+",  label: "Cities" },
// ];

// // ── Scroll to top on route change ────────────────────
// function ScrollToTop() {
//   const { pathname } = useLocation();
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "instant" });
//   }, [pathname]);
//   return null;
// }

// // ── Footer ────────────────────────────────────────────
// const Footer = () => {
//   const { pathname } = useLocation();

//   return (
//     <>
//       <ScrollToTop />
//       <footer style={{ background: "var(--on-surface)", color: "var(--surface)", fontFamily: "var(--font-body)" }}>

//         {/* ── TOP: brand + stats ── */}
//         <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "56px 40px 48px" }}>
//           <div style={{
//             maxWidth: "1100px",
//             margin: "0 auto",
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "48px",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//           }}>

//             {/* Brand + description + social */}
//             <div style={{ maxWidth: "300px" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
//                 <div style={{
//                   width: "10px", height: "10px",
//                   borderRadius: "50%",
//                   background: "var(--primary-fixed-dim)",
//                   flexShrink: 0,
//                 }} />
//                 <span style={{
//                   fontFamily: "var(--font-display)",
//                   fontWeight: 900,
//                   fontSize: "1.25rem",
//                   color: "#fff",
//                   letterSpacing: "-0.02em",
//                 }}>
//                   TiffinBox
//                 </span>
//               </div>

//               <p style={{
//                 fontSize: "0.875rem",
//                 color: "rgba(255,255,255,0.5)",
//                 lineHeight: 1.75,
//                 marginBottom: "28px",
//               }}>
//                 Fresh homemade meals from verified home cooks in your city. Pre-order before cutoff and eat like home.
//               </p>

//               <div style={{ display: "flex", gap: "10px" }}>
//                 {socialLinks.map(({ icon, label, href }) => (
//                   <a
//                     key={label}
//                     href={href}
//                     title={label}
//                     style={{
//                       width: "38px",
//                       height: "38px",
//                       borderRadius: "var(--radius-lg)",
//                       background: "rgba(255,255,255,0.07)",
//                       border: "1px solid rgba(255,255,255,0.08)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "rgba(255,255,255,0.55)",
//                       textDecoration: "none",
//                       transition: "background 0.2s, color 0.2s",
//                     }}
//                     onMouseEnter={e => {
//                       e.currentTarget.style.background = "var(--primary)";
//                       e.currentTarget.style.color = "#fff";
//                     }}
//                     onMouseLeave={e => {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.07)";
//                       e.currentTarget.style.color = "rgba(255,255,255,0.55)";
//                     }}
//                   >
//                     <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>{icon}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Stats */}
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "0" }}>
//               {stats.map(({ num, label }, i) => (
//                 <div
//                   key={label}
//                   style={{
//                     padding: "0 32px",
//                     borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
//                     textAlign: "center",
//                   }}
//                 >
//                   <div style={{
//                     fontFamily: "var(--font-display)",
//                     fontSize: "1.75rem",
//                     fontWeight: 900,
//                     color: "var(--primary-fixed-dim)",
//                     letterSpacing: "-0.04em",
//                     lineHeight: 1,
//                     marginBottom: "6px",
//                   }}>
//                     {num}
//                   </div>
//                   <div style={{
//                     fontSize: "0.6875rem",
//                     color: "rgba(255,255,255,0.35)",
//                     fontWeight: 600,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.07em",
//                   }}>
//                     {label}
//                   </div>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>

//         {/* ── MIDDLE: 4-column link grid ── */}
//         <div style={{ padding: "48px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//           <div style={{
//             maxWidth: "1100px",
//             margin: "0 auto",
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "32px",
//           }}>
//             {columns.map(({ heading, links }) => (
//               <div key={heading}>
//                 <p style={{
//                   fontSize: "0.6875rem",
//                   fontWeight: 700,
//                   color: "rgba(255,255,255,0.28)",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                   marginBottom: "20px",
//                   fontFamily: "var(--font-body)",
//                 }}>
//                   {heading}
//                 </p>

//                 <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
//                   {links.map(({ label, path }) => {
//                     const isActive = pathname === path;
//                     return (
//                       <li key={path}>
//                         <Link
//                           to={path}
//                           style={{
//                             fontSize: "0.875rem",
//                             fontFamily: "var(--font-body)",
//                             fontWeight: isActive ? 700 : 400,
//                             color: isActive ? "var(--primary-fixed-dim)" : "rgba(255,255,255,0.55)",
//                             textDecoration: "none",
//                             transition: "color 0.15s",
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: "7px",
//                           }}
//                           onMouseEnter={e => e.currentTarget.style.color = "var(--primary-fixed-dim)"}
//                           onMouseLeave={e => e.currentTarget.style.color = isActive ? "var(--primary-fixed-dim)" : "rgba(255,255,255,0.55)"}
//                         >
//                           {/* Active indicator dot */}
//                           {isActive && (
//                             <span style={{
//                               width: "4px",
//                               height: "4px",
//                               borderRadius: "50%",
//                               background: "var(--primary-fixed-dim)",
//                               display: "inline-block",
//                               flexShrink: 0,
//                             }} />
//                           )}
//                           {label}
//                         </Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── BOTTOM: copyright + accent bars ── */}
//         <div style={{ padding: "28px 40px" }}>
//           <div style={{
//             maxWidth: "1100px",
//             margin: "0 auto",
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: "16px",
//           }}>
//             <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body)" }}>
//               © 2026 TiffinBox. All rights reserved. Made with ❤️ in India.
//             </p>

//             {/* Design system accent bars */}
//             <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
//               <div style={{ width: "40px", height: "3px", borderRadius: "99px", background: "var(--primary-fixed-dim)" }} />
//               <div style={{ width: "14px", height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.1)" }} />
//               <div style={{ width: "14px", height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.1)" }} />
//             </div>
//           </div>
//         </div>

//       </footer>
//     </>
//   );
// };

// export default Footer;
