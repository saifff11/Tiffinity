import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const MiscNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        background: "rgba(249,249,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(20,27,43,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "var(--font-body)",
        width: "100%",
        left: 0,
        right: 0,
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          minHeight: "44px",
          padding: isMobile ? "8px 12px" : "10px 24px",
          maxWidth: "100%",
          boxSizing: "border-box",
          margin: "0 auto",
        }}>
        {/* Brand */}
        <span
          onClick={() => handleNavigate("/")}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "1.1rem",
            color: "var(--on-surface)",
            letterSpacing: "-0.02em",
            cursor: "pointer",
            userSelect: "none",
            whiteSpace: "nowrap",
            flex: "0 0 auto",
          }}>
          TiffinBox
        </span>

        {/* center - desktop only */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flex: "1 1 auto",
            }}>
            <NavBtn
              plain
              active={location.pathname === "/"}
              label='Home'
              onClick={() => handleNavigate("/")}
            />
            <NavBtn
              plain
              active={location.pathname === "/how-it-works"}
              label='How It Works'
              onClick={() => handleNavigate("/how-it-works")}
            />
            <NavBtn
              plain
              active={location.pathname === "/register"}
              label='Join as a Cook'
              onClick={() => handleNavigate("/register")}
            />
          </div>
        )}

        {/* Right side - desktop only */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flex: "0 1 auto",
            }}>
            <NavBtn label='Login' onClick={() => handleNavigate("/login")} />
            <NavBtn
              label='Sign Up'
              onClick={() => handleNavigate("/register")}
            />
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            type='button'
            aria-label='Toggle navigation menu'
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "none",
              background: menuOpen
                ? "var(--primary-fixed-dim)"
                : "var(--primary-fixed)",
              color: "var(--primary-container)",
              cursor: "pointer",
              flex: "0 0 auto",
              padding: 0,
              marginLeft: "auto",
            }}>
            <span
              className='material-symbols-outlined'
              style={{ fontSize: "20px" }}>
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        )}
      </div>

      {/* Mobile menu panel */}
      {menuOpen && isMobile && (
        <div
          style={{
            borderTop: "1px solid rgba(20,27,43,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px",
            boxSizing: "border-box",
            backgroundColor: "rgba(249,249,255,0.95)",
          }}>
          <NavBtn
            plain
            active={location.pathname === "/"}
            label='Home'
            onClick={() => handleNavigate("/")}
          />
          <NavBtn
            plain
            active={location.pathname === "/how-it-works"}
            label='How It Works'
            onClick={() => handleNavigate("/how-it-works")}
          />
          <NavBtn
            plain
            active={location.pathname === "/register"}
            label='Join as a Cook'
            onClick={() => handleNavigate("/register")}
          />
          <div
            style={{
              borderTop: "1px solid rgba(20,27,43,0.08)",
              marginTop: "4px",
              paddingTop: "8px",
            }}>
            <NavBtn
              active={location.pathname === "/login"}
              label='Login'
              onClick={() => handleNavigate("/login")}
              style={{ width: "100%" }}
            />
            <NavBtn
              active={location.pathname === "/register"}
              label='Sign Up'
              onClick={() => handleNavigate("/register")}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

function NavBtn({ icon, label, onClick, danger, plain, active, style }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "0.9rem",
        transition: "all 0.2s",
        background: danger
          ? hovered
            ? "#fee2e2"
            : "transparent"
          : plain
            ? "transparent"
            : hovered
              ? "var(--primary-fixed-dim)"
              : "var(--primary-fixed)",
        color: danger
          ? hovered
            ? "#991b1b"
            : "var(--on-surface-variant)"
          : plain
            ? active
              ? "var(--primary)"
              : "var(--on-surface)"
            : "var(--primary-container)",
        whiteSpace: "nowrap",
        ...style,
      }}>
      {icon} {label}
    </button>
  );
}

export default MiscNavbar;
