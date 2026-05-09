import { useEffect, useState } from "react";

function Alert({ type = "error", message, onClose, duration = 2500 }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message || !onClose) return;

    const resetTimeout = setTimeout(() => {
      setProgress(100);
      setVisible(false);
    }, 0);

    const enterTimeout = setTimeout(() => setVisible(true), 10);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - 100 / (duration / 100);
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => {
      clearTimeout(resetTimeout);
      clearTimeout(enterTimeout);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [message, onClose, duration]);

  if (!message) return null;

  const styles = {
    error: {
      bg: "var(--error-bg)",
      color: "var(--error)",
      border: "var(--error-border)",
      bar: "var(--error)",
      icon: "error",
    },
    success: {
      bg: "var(--success-bg)",
      color: "var(--success)",
      border: "var(--success-border)",
      bar: "var(--primary)",
      icon: "check_circle",
    },
    warning: {
      bg: "#fffbeb",
      color: "#b45309",
      border: "rgba(180,83,9,0.2)",
      bar: "#b45309",
      icon: "warning",
    },
    info: {
      bg: "var(--primary-fixed)",
      color: "var(--primary-container)",
      border: "rgba(6,78,59,0.15)",
      bar: "var(--primary)",
      icon: "info",
    },
  };

  const s = styles[type];

  return (
    <div
      style={{
        position: "fixed",
        top: "clamp(64px, 12vw, 80px)",
        right: "clamp(8px, 3vw, 12px)",
        left: "clamp(8px, 3vw, 12px)",
        zIndex: 9999,
        minWidth: 0,
        maxWidth: "min(420px, calc(100vw - 16px))",
        width: "100%",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-lg)",
        fontFamily: "var(--font-body)",
        boxShadow: "0 8px 32px rgba(20,27,43,0.1)",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateY(-12px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        marginLeft: "auto",
      }}>
      {/* Content */}
      <div
        style={{
          padding: "clamp(11px, 3vw, 13px) clamp(12px, 3.5vw, 16px)",
          display: "flex",
          alignItems: "flex-start",
          gap: "clamp(8px, 2.5vw, 10px)",
          justifyContent: "space-between",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(8px, 2.5vw, 10px)",
            flex: 1,
            minWidth: 0,
          }}>
          <span
            className='material-symbols-outlined'
            style={{
              fontSize: "clamp(16px, 4vw, 18px)",
              color: s.color,
              flexShrink: 0,
              marginTop: "1px",
            }}>
            {s.icon}
          </span>
          <span
            style={{
              fontSize: "clamp(0.8rem, 2.8vw, 0.875rem)",
              fontWeight: 500,
              lineHeight: 1.5,
              color: s.color,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}>
            {message}
          </span>
        </div>

        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: s.color,
              opacity: 0.55,
              padding: "0",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "flex-start",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}>
            <span
              className='material-symbols-outlined'
              style={{ fontSize: "clamp(16px, 4vw, 18px)" }}>
              close
            </span>
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "rgba(0,0,0,0.06)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: s.bar,
            opacity: 0.5,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}

export default Alert;
