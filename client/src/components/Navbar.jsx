import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import NotificationBell from "./NotificationBell";
import {
  ArrowLeft,
  ClipboardList,
  PlusCircle,
  ListOrdered,
  Users,
  ChefHat,
  Key,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const ROLE_NAV_LINKS = {
  customer: [{ label: "My Orders", path: "/orders/my", icon: ClipboardList }],
  cook: [
    { label: "Post Menu", path: "/cook/post-menu", icon: PlusCircle },
    { label: "Orders", path: "/cook/orders", icon: ListOrdered },
  ],
  admin: [
    { label: "Pending Cooks", path: "/admin/pending-cooks", icon: Users },
  ],
};

function Navbar({ showBack, backPath, backLabel }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const role = user?.role || "customer";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getHomePath = () => {
    if (user?.role === "cook") return "/cook/dashboard";
    if (user?.role === "admin") return "/admin/dashboard";
    return "/home";
  };

  const homePath = getHomePath();
  const roleLinks = ROLE_NAV_LINKS[role] || [];
  const backDestination = typeof backPath === "string" ? backPath : null;
  const shouldShowMobileHomeShortcut =
    !showBack || !backDestination || backDestination !== homePath;

  const mobileHomeLabel =
    role === "admin"
      ? "Admin Dashboard"
      : role === "cook"
        ? "Cook Dashboard"
        : "Home";

  const handleNavigate = (pathOrDelta) => {
    navigate(pathOrDelta);
  };

  const closeMobileAndNavigate = (pathOrDelta) => {
    setMobileNavOpen(false);
    navigate(pathOrDelta);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMobileNavOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      className='px-3 sm:px-4 md:px-6'
      style={{
        background: "rgba(249,249,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(20,27,43,0.06)",
        padding: "clamp(8px, 2vw, 10px) clamp(12px, 4vw, 40px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        fontFamily: "var(--font-body)",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(8px, 2vw, 10px)",
          minHeight: "36px",
        }}>
        {/* Brand */}
        <span
          className='text-lg sm:text-xl cursor-pointer'
          onClick={() => navigate(getHomePath())}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(1rem, 3vw, 1.15rem)",
            color: "var(--on-surface)",
            letterSpacing: "-0.02em",
            cursor: "pointer",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}>
          TiffinBox
        </span>

        {/* Right side */}
        <div
          className='hidden sm:flex flex-wrap gap-2 sm:gap-3'
          style={{
            alignItems: "center",
            gap: "clamp(8px, 1.5vw, 10px)",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            marginLeft: "auto",
          }}>
          {/* Back button */}
          {showBack && (
            <NavBtn
              icon={<ArrowLeft size={14} />}
              label={backLabel || "Back"}
              onClick={() => handleNavigate(backPath || -1)}
            />
          )}

          {roleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavBtn
                key={link.path}
                icon={<Icon size={14} />}
                label={link.label}
                onClick={() => handleNavigate(link.path)}
              />
            );
          })}

          <NotificationBell />

          {/* User chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-container-high)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--on-surface-variant)",
              userSelect: "none",
              maxWidth: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {user?.role === "cook" ? (
              <ChefHat size={14} />
            ) : user?.role === "admin" ? (
              <Key size={14} />
            ) : (
              <UserIcon size={14} />
            )}
            {user?.name?.split(" ")[0]}
          </div>

          {/* Logout */}
          <NavBtn
            icon={<LogOut size={14} />}
            label='Logout'
            onClick={handleLogout}
            danger
          />
        </div>

        <div
          className='flex sm:hidden items-center gap-2'
          style={{ marginLeft: "auto" }}>
          <NotificationBell />
          <button
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label='Toggle navigation menu'
            style={{
              width: "clamp(32px, 7vw, 36px)",
              height: "clamp(32px, 7vw, 36px)",
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: mobileNavOpen
                ? "var(--primary-fixed)"
                : "var(--surface-container-high)",
              color: mobileNavOpen
                ? "var(--primary-container)"
                : "var(--on-surface-variant)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}>
            {mobileNavOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div
          className='sm:hidden'
          style={{
            width: "100%",
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid var(--surface-container-high)",
            display: "grid",
            gap: "8px",
          }}>
          {showBack && (
            <button
              onClick={() => closeMobileAndNavigate(backPath || -1)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "var(--surface-container-high)",
                color: "var(--on-surface-variant)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.8125rem",
              }}>
              <ArrowLeft size={14} /> {backLabel || "Back"}
            </button>
          )}

          {shouldShowMobileHomeShortcut && (
            <button
              onClick={() => closeMobileAndNavigate(homePath)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "var(--surface-container-high)",
                color: "var(--on-surface-variant)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.8125rem",
              }}>
              {role === "cook" ? <ChefHat size={14} /> : <UserIcon size={14} />}{" "}
              {mobileHomeLabel}
            </button>
          )}

          {roleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={`mobile-${link.path}`}
                onClick={() => closeMobileAndNavigate(link.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-lg)",
                  border: "none",
                  background: "var(--primary-fixed)",
                  color: "var(--primary-container)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                }}>
                <Icon size={14} /> {link.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              setMobileNavOpen(false);
              handleLogout();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(220,38,38,0.25)",
              background: "#fee2e2",
              color: "#991b1b",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.8125rem",
            }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}

/* ── Small reusable nav button ── */
function NavBtn({ icon, label, onClick, danger }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className='px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-xs md:text-sm'
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(4px, 1vw, 6px)",
        padding: "clamp(6px, 1vw, 8px) clamp(10px, 2vw, 14px)",
        borderRadius: "var(--radius-lg)",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "clamp(0.7rem, 1.5vw, 0.8125rem)",
        transition: "all 0.2s",
        background: danger
          ? hovered
            ? "#fee2e2"
            : "transparent"
          : hovered
            ? "var(--primary-fixed-dim)"
            : "var(--primary-fixed)",
        color: danger
          ? hovered
            ? "#991b1b"
            : "var(--on-surface-variant)"
          : "var(--primary-container)",
        whiteSpace: "nowrap",
      }}>
      {icon} {label}
    </button>
  );
}

export default Navbar;
