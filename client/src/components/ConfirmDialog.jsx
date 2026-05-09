import { useState } from "react";

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  confirmColor = "#DC2626",
}) {
  const [loading, setLoading] = useState(false);

  if (!message) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,27,43,0.4)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}>
      <div
        style={{
          background: "var(--surface-container-lowest)",
          borderRadius: "var(--radius-lg)",
          padding: "clamp(20px, 5vw, 32px) clamp(16px, 4vw, 28px)",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 16px 48px rgba(20,27,43,0.18)",
          fontFamily: "var(--font-body)",
        }}>
        {/* Icon */}
        <div
          style={{
            width: "clamp(40px, 10vw, 48px)",
            height: "clamp(40px, 10vw, 48px)",
            borderRadius: "50%",
            background:
              confirmColor === "#DC2626" ? "#fee2e2" : "var(--primary-fixed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "clamp(14px, 3vw, 20px)",
          }}>
          <span
            className='material-symbols-outlined'
            style={{
              fontSize: "clamp(16px, 4vw, 22px)",
              color:
                confirmColor === "#DC2626"
                  ? "#991b1b"
                  : "var(--primary-container)",
            }}>
            {confirmColor === "#DC2626" ? "warning" : "check_circle"}
          </span>
        </div>

        {/* Message */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
            color: "var(--on-surface)",
            letterSpacing: "-0.02em",
            lineHeight: 1.5,
            marginBottom: "clamp(20px, 5vw, 28px)",
          }}>
          {message}
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "clamp(6px, 2vw, 10px)",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "clamp(8px, 2vw, 10px) clamp(14px, 3vw, 20px)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--surface-container-high)",
              background: "var(--surface-container-low)",
              color: "var(--on-surface-variant)",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "background 0.15s",
              minWidth: "min(100%, 100px)",
              flex: "1 1 auto",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.background =
                  "var(--surface-container-high)";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                e.currentTarget.style.background =
                  "var(--surface-container-low)";
            }}>
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              padding: "clamp(8px, 2vw, 10px) clamp(14px, 3vw, 20px)",
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: confirmColor,
              color: "#fff",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(6px, 1.5vw, 8px)",
              transition: "opacity 0.15s",
              minWidth: "min(100%, 110px)",
              flex: "1 1 auto",
            }}>
            {loading && (
              <div
                style={{
                  width: "13px",
                  height: "13px",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  flexShrink: 0,
                }}
              />
            )}
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default ConfirmDialog;
