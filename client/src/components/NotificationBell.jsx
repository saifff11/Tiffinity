import { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Bell } from "lucide-react";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  const bellRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target) && open) {
        setNotifications((notifications) =>
          notifications.map((n) => ({ ...n, isRead: true })),
        );
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get("/notifications");
      setNotifications(data.notifications);
    } catch (err) {
      void err;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications();
  }, []);

  const handleOpen = async () => {
    if (!open) {
      try {
        await axiosInstance.put("/notifications/read");
      } catch (err) {
        void err;
      }
    } else {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
    setOpen(!open);
  };

  const unreadCount = open ? 0 : notifications.filter((n) => !n.isRead).length;

  return (
    <div ref={bellRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          position: "relative",
          background: open
            ? "var(--primary-fixed)"
            : "var(--surface-container-high)",
          border: "none",
          borderRadius: "var(--radius-lg)",
          width: "clamp(32px, 7vw, 36px)",
          height: "clamp(32px, 7vw, 36px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--primary-fixed)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = open
            ? "var(--primary-fixed)"
            : "var(--surface-container-high)")
        }>
        <Bell
          size={isMobileView ? 14 : 15}
          color={
            open ? "var(--primary-container)" : "var(--on-surface-variant)"
          }
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              background: "var(--error)",
              color: "#fff",
              borderRadius: "var(--radius-pill)",
              fontSize: "clamp(0.56rem, 1.8vw, 0.625rem)",
              fontWeight: 700,
              minWidth: "clamp(13px, 3.8vw, 15px)",
              height: "clamp(13px, 3.8vw, 15px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              fontFamily: "var(--font-body)",
              border: "2px solid var(--surface-container-lowest)",
            }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: isMobileView ? "fixed" : "absolute",
            right: isMobileView ? "12px" : "0",
            left: isMobileView ? "12px" : "auto",
            top: isMobileView ? "64px" : "46px",
            width: isMobileView ? "auto" : "min(320px, calc(100vw - 24px))",
            maxHeight: isMobileView ? "min(70vh, 520px)" : "none",
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 8px 32px rgba(20,27,43,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}>
          {/* Header */}
          <div
            style={{
              padding: "clamp(12px, 2.5vw, 14px) clamp(14px, 3vw, 18px)",
              borderBottom: "1px solid var(--surface-container-high)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(0.8125rem, 2.8vw, 0.9375rem)",
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
              }}>
              Notifications
            </span>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span
                style={{
                  fontSize: "clamp(0.625rem, 2vw, 0.6875rem)",
                  fontWeight: 700,
                  color: "var(--primary-container)",
                  background: "var(--primary-fixed)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-pill)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                {notifications.filter((n) => !n.isRead).length} new
              </span>
            )}
          </div>

          {/* Body */}
          {notifications.length === 0 ? (
            <div
              style={{
                padding: "clamp(28px, 7vw, 40px) clamp(16px, 4vw, 24px)",
                textAlign: "center",
              }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "var(--surface-container-high)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                <Bell size={18} color='var(--outline)' />
              </div>
              <p
                style={{
                  fontSize: "clamp(0.8125rem, 2.4vw, 0.875rem)",
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  marginBottom: "4px",
                  fontFamily: "var(--font-display)",
                }}>
                All caught up
              </p>
              <p
                style={{
                  fontSize: "clamp(0.75rem, 2.2vw, 0.8125rem)",
                  color: "var(--on-surface-variant)",
                }}>
                No notifications yet
              </p>
            </div>
          ) : (
            <div
              style={{
                maxHeight: isMobileView ? "min(54vh, 420px)" : "340px",
                overflowY: "auto",
              }}>
              {notifications.map((n, i) => (
                <div
                  key={n._id}
                  style={{
                    padding: "clamp(10px, 2.8vw, 13px) clamp(12px, 3vw, 18px)",
                    background: n.isRead
                      ? "transparent"
                      : "var(--primary-fixed)",
                    borderBottom:
                      i < notifications.length - 1
                        ? "1px solid var(--surface-container-high)"
                        : "none",
                    transition: "background 0.2s",
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}>
                  {/* Unread dot */}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: n.isRead ? "transparent" : "var(--primary)",
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "clamp(0.8125rem, 2.2vw, 0.875rem)",
                        color: "var(--on-surface)",
                        fontWeight: n.isRead ? 400 : 600,
                        lineHeight: 1.5,
                        marginBottom: "3px",
                        fontFamily: "var(--font-body)",
                      }}>
                      {n.message}
                    </p>
                    <p
                      style={{
                        fontSize: "clamp(0.6875rem, 1.9vw, 0.75rem)",
                        color: "var(--on-surface-variant)",
                        fontFamily: "var(--font-body)",
                      }}>
                      {new Date(n.createdAt).toLocaleDateString()} at{" "}
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
