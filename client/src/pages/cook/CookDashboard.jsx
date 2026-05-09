import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import NotificationBell from "../../components/NotificationBell";
import Alert from "../../components/Alert";
import {
  ListOrdered,
  Hourglass,
  ChefHat,
  Star,
  BadgeCheck,
  PlusCircle,
  LogOut,
  Clock,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { validateCookProfile } from "../../utils/validate";
import Footer from "../../components/Footer";
import { getTimeRemainingToCutoffInIST } from "../../utils/timeZone";

function CookDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [cookProfile, setCookProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    cuisineType: "",
    city: "",
    address: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [todayMenus, setTodayMenus] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const getTimeRemaining = (cutoffTime) => {
    return getTimeRemainingToCutoffInIST(cutoffTime, true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/cook/profile/me");
        setCookProfile(data.cookProfile);
        const menuRes = await axiosInstance.get("/menu/my");
        setTodayMenus(menuRes.data.menus);
        setFormData({
          bio: data.cookProfile.bio,
          cuisineType: data.cookProfile.cuisineType?.join(", "),
          city: data.cookProfile.city,
          address: data.cookProfile.address,
        });
      } catch (err) {
        if (err.response?.status === 404) navigate("/cook/setup");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateCookProfile(formData) || {};
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors);
      setError(firstError);
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      form.append("bio", formData.bio);
      form.append("cuisineType", formData.cuisineType);
      form.append("city", formData.city);
      form.append("address", formData.address);
      if (photo) form.append("photo", photo);

      const { data } = await axiosInstance.put("/cook/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCookProfile(data.cookProfile);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const labelStyle = {
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "var(--on-surface-variant)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  // const handleToggleAvailability = async () => {
  //   try {
  //     const { data } = await axiosInstance.put("/cook/availability");
  //     setCookProfile({ ...cookProfile, isAvailable: data.isAvailable });
  //     setSuccess(data.message);
  //   } catch (err) {
  //     setError("Something went wrong");
  //   }
  // };

  /* ── Loading ── */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--surface)",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid var(--primary-fixed)",
              borderTopColor: "var(--primary)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              fontFamily: "var(--font-body)",
            }}>
            Loading your kitchen…
          </span>
        </div>
      </div>
    );

  /* ── Pending verification ── */
  if (cookProfile && !cookProfile.isVerified)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface-container-low)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}>
        <div
          style={{
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            padding: "56px 48px",
            width: "100%",
            maxWidth: "480px",
            textAlign: "center",
            boxShadow: "0 4px 32px rgba(20,27,43,0.06)",
          }}>
          {/* Icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--primary-fixed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
            <Hourglass
              size={32}
              strokeWidth={1.5}
              color='var(--primary-container)'
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.5rem",
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}>
            Profile under review
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--on-surface-variant)",
              lineHeight: 1.7,
              marginBottom: "20px",
            }}>
            Your cook profile has been submitted and is currently being reviewed
            by our team. We'll notify you via email once approved — usually
            within 24 hours.
          </p>

          {/* Email chip */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-container-high)",
              fontSize: "0.8125rem",
              color: "var(--on-surface-variant)",
              marginBottom: "32px",
              fontFamily: "var(--font-body)",
            }}>
            <span
              className='material-symbols-outlined'
              style={{ fontSize: "15px" }}>
              mail
            </span>
            {user?.email}
          </div>

          <button
            className='auth-btn'
            style={{
              maxWidth: "180px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>
    );

  /* ── Main dashboard ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}>
      {/* ── NAVBAR ── */}
      <nav
        className='px-3 sm:px-4 md:px-6'
        style={{
          background: "rgba(249,249,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(20,27,43,0.06)",
          padding: "clamp(8px, 2vw, 10px) clamp(12px, 4vw, 40px)",
          minHeight: "56px",
          height: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(8px, 2vw, 10px)",
          flexWrap: "wrap",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
        <span
          onClick={() => navigate("/cook/dashboard")}
          className='text-lg sm:text-xl'
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(1rem, 3vw, 1.15rem)",
            color: "var(--on-surface)",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}>
          TiffinBox
        </span>

        <div
          className='hidden sm:flex flex-wrap gap-2 sm:gap-3'
          style={{
            alignItems: "center",
            gap: "clamp(8px, 1.5vw, 10px)",
            flexWrap: "wrap",
            marginLeft: "auto",
            justifyContent: "flex-end",
          }}>
          <NotificationBell />

          <NavBtn
            icon={<PlusCircle size={14} />}
            label='Post Menu'
            onClick={() => navigate("/cook/post-menu")}
          />
          <NavBtn
            icon={<ListOrdered size={14} />}
            label='Orders'
            onClick={() => navigate("/cook/orders")}
          />
          {/* User chip */}
          <div
            className='px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-xs flex'
            style={{
              alignItems: "center",
              gap: "clamp(4px, 1vw, 6px)",
              padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-container-high)",
              fontSize: "clamp(0.7rem, 1.5vw, 0.8125rem)",
              fontWeight: 600,
              color: "var(--on-surface-variant)",
            }}>
            <span className='hidden sm:inline-flex'>
              <ChefHat size={14} />
            </span>
            <span>{user?.name}</span>
          </div>
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
            <button
              onClick={() => {
                setMobileNavOpen(false);
                navigate("/cook/post-menu");
              }}
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
              <PlusCircle size={14} /> Post Menu
            </button>

            <button
              onClick={() => {
                setMobileNavOpen(false);
                navigate("/cook/orders");
              }}
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
              <ListOrdered size={14} /> Orders
            </button>

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

      {/* ── CONTENT ── */}
      <div
        className='px-3 sm:px-4 md:px-6'
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px clamp(12px, 4vw, 40px) 64px",
        }}>
        {/* Page header */}
        <div className='mb-6 sm:mb-8 md:mb-9' style={{ marginBottom: "36px" }}>
          <h1
            className='text-2xl sm:text-3xl md:text-4xl'
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "2.25rem",
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "6px",
            }}>
            Welcome back,
            <br />
            <span style={{ color: "var(--primary-container)" }}>
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p
            className='text-sm sm:text-base'
            style={{ fontSize: "1rem", color: "var(--on-surface-variant)" }}>
            Here's your cook dashboard
          </p>
        </div>

        {/* ── STAT CARDS ── */}
        <div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8'
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
            gap: "clamp(12px, 3vw, 16px)",
            marginBottom: "clamp(24px, 5vw, 32px)",
          }}>
          {[
            {
              label: "Total Earnings",
              value: `₹${cookProfile?.earnings?.total || 0}`,
              accent: "var(--primary-container)",
            },
            {
              label: "This Week",
              value: `₹${cookProfile?.earnings?.thisWeek || 0}`,
              accent: "var(--primary)",
            },
            {
              label: "Rating",
              value: cookProfile?.rating || 0,
              accent: "#b45309",
              extra: (
                <Star
                  size={18}
                  fill='currentColor'
                  style={{ color: "#b45309" }}
                />
              ),
            },
            {
              label: "Total Reviews",
              value: cookProfile?.totalReviews || 0,
              accent: "var(--on-surface)",
            },
          ].map(({ label, value, accent, extra }) => (
            <div
              key={label}
              className='p-4 sm:p-5 md:p-6'
              style={{
                background: "var(--surface-container-lowest)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(16px, 3vw, 24px)",
                boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                borderTop: `3px solid ${accent}`,
              }}>
              <p
                className='text-xs sm:text-xs md:text-sm'
                style={{
                  fontSize: "clamp(0.65rem, 1.5vw, 0.6875rem)",
                  fontWeight: 700,
                  color: "var(--on-surface-variant)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "clamp(6px, 1.5vw, 10px)",
                }}>
                {label}
              </p>
              <div
                className='text-xl sm:text-2xl md:text-4xl'
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.25rem, 4vw, 2rem)",
                  fontWeight: 900,
                  color: accent,
                  letterSpacing: "-0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(4px, 1vw, 6px)",
                }}>
                {value}
                {extra}
              </div>
            </div>
          ))}
        </div>

        {/* ── TODAY'S LIVE MENU ── */}
        <div
          className='mb-6 sm:mb-7'
          style={{
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 8px 28px rgba(20,27,43,0.06)",
            marginBottom: "clamp(20px, 4vw, 28px)",
            border: "1px solid rgba(20,27,43,0.08)",
            overflow: "hidden",
          }}>
          {/* Header */}
          <div
            className='flex flex-col sm:flex-row gap-3 sm:gap-4'
            style={{
              padding: "clamp(14px, 3vw, 20px) clamp(14px, 4vw, 28px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              background:
                "linear-gradient(180deg, rgba(6,78,59,0.06) 0%, rgba(6,78,59,0.02) 100%)",
              borderBottom: "1px solid var(--surface-container-high)",
            }}>
            {/* <button
              className={
                cookProfile?.isAvailable ? "btn-reject" : "btn-approve"
              }
              style={{ marginLeft: 0 }}
              onClick={handleToggleAvailability}>
              {cookProfile?.isAvailable ? "🔴 Go Offline" : "🟢 Go Online"}
            </button> */}
            <div>
              <h2
                className='text-base sm:text-lg'
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}>
                Today's Live Menu
              </h2>
              <p
                className='text-xs sm:text-sm'
                style={{
                  marginTop: "4px",
                  marginBottom: 0,
                  color: "var(--on-surface-variant)",
                  fontSize: "clamp(0.72rem, 2.2vw, 0.8125rem)",
                }}>
                Manage your active meals and cutoff timings.
              </p>
            </div>
            <button
              onClick={() => navigate("/cook/post-menu")}
              className='w-full sm:w-auto justify-center'
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "clamp(7px, 1.8vw, 9px) clamp(12px, 3vw, 16px)",
                borderRadius: "var(--radius-lg)",
                background: "var(--primary-fixed)",
                color: "var(--primary-container)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(0.75rem, 2vw, 0.8125rem)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--primary-fixed-dim)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--primary-fixed)")
              }>
              <PlusCircle size={14} /> Post Menu
            </button>
          </div>

          {/* Empty state */}
          {todayMenus.length === 0 ? (
            <div
              style={{
                padding: "clamp(32px, 8vw, 48px) clamp(14px, 4vw, 28px)",
                textAlign: "center",
              }}>
              <div
                style={{
                  width: "clamp(44px, 12vw, 56px)",
                  height: "clamp(44px, 12vw, 56px)",
                  borderRadius: "50%",
                  background: "var(--surface-container-high)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                <UtensilsCrossed size={24} color='var(--outline)' />
              </div>
              <p
                style={{
                  fontSize: "clamp(0.8125rem, 2.4vw, 0.9375rem)",
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  marginBottom: "6px",
                }}>
                No menu posted today
              </p>
              <p
                style={{
                  fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                  color: "var(--on-surface-variant)",
                }}>
                Post your menu so customers can start ordering.
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "clamp(14px, 3vw, 20px) clamp(14px, 4vw, 28px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(10px, 2vw, 12px)",
              }}>
              {todayMenus.map((menu) => {
                const expired = getTimeRemaining(menu.cutoffTime) === "Expired";
                return (
                  <div
                    key={menu._id}
                    style={{
                      padding: "clamp(12px, 3vw, 16px) clamp(12px, 3vw, 20px)",
                      background: expired
                        ? "var(--surface-container-low)"
                        : "rgba(6,78,59,0.08)",
                      borderRadius: "var(--radius-lg)",
                      borderLeft: `4px solid ${expired ? "var(--outline)" : "var(--primary)"}`,
                      border: `1px solid ${expired ? "rgba(20,27,43,0.08)" : "rgba(6,78,59,0.2)"}`,
                      opacity: expired ? 0.65 : 1,
                      transition: "opacity 0.2s, transform 0.2s",
                    }}>
                    <div
                      className='flex flex-col sm:flex-row gap-2 sm:gap-3'
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                      }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "clamp(0.8125rem, 2.4vw, 0.9375rem)",
                          color: "var(--on-surface)",
                          textTransform: "capitalize",
                          letterSpacing: "-0.01em",
                        }}>
                        {menu.mealType} menu
                      </span>
                      <span
                        style={{
                          fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                          fontWeight: 600,
                          color: expired
                            ? "var(--error)"
                            : "var(--primary-container)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          background: expired
                            ? "rgba(220,38,38,0.08)"
                            : "rgba(6,78,59,0.08)",
                          padding:
                            "clamp(3px, 1vw, 4px) clamp(8px, 2.5vw, 10px)",
                          borderRadius: "var(--radius-pill)",
                        }}>
                        <Clock size={11} />
                        {expired
                          ? "Expired"
                          : `Cutoff ${menu.cutoffTime} · ${getTimeRemaining(menu.cutoffTime)}`}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {menu.dishes?.map((d, i) => (
                        <span
                          key={i}
                          style={{
                            padding:
                              "clamp(3px, 1vw, 4px) clamp(9px, 2.5vw, 12px)",
                            borderRadius: "var(--radius-pill)",
                            background: expired
                              ? "var(--surface-container-high)"
                              : "rgba(6,78,59,0.1)",
                            color: expired
                              ? "var(--on-surface-variant)"
                              : "var(--primary-container)",
                            fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                          }}>
                          {d.name} · ₹{d.price} · {d.portionsLeft}/
                          {d.maxPortions} left
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── PROFILE CARD ── */}
        <div
          style={{
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
            overflow: "hidden",
          }}>
          {/* Header */}
          <div
            className='px-4 sm:px-5 md:px-6 flex flex-col sm:flex-row gap-3 sm:gap-4'
            style={{
              padding: "clamp(16px, 3vw, 28px)",
              display: "flex",
              // alignItems: "center",
              justifyContent: "space-between",
              background:
                "linear-gradient(180deg, rgba(20,27,43,0.03) 0%, rgba(20,27,43,0) 100%)",
              borderBottom: "1px solid var(--surface-container-high)",
              flexWrap: "wrap",
            }}>
            <div>
              <h2
                className='text-base sm:text-lg md:text-xl'
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}>
                Your Profile
              </h2>
              <p
                className='text-xs sm:text-sm'
                style={{
                  marginTop: "4px",
                  marginBottom: 0,
                  color: "var(--on-surface-variant)",
                  fontSize: "clamp(0.72rem, 2.2vw, 0.8125rem)",
                }}>
                Keep details fresh to build customer trust.
              </p>
            </div>
            <div
              className='flex flex-wrap gap-2 sm:gap-3'
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 10px)",
              }}>
              {/* Verified badge */}
              <span
                className='text-xs sm:text-sm'
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "clamp(3px, 1vw, 4px) clamp(9px, 2.2vw, 12px)",
                  borderRadius: "var(--radius-pill)",
                  background: "rgba(6,78,59,0.12)",
                  color: "var(--primary-container)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                <BadgeCheck size={13} /> Verified
              </span>
              <button
                onClick={() => {
                  setEditing(!editing);
                  setSuccess("");
                  setError("");
                }}
                className='px-3 sm:px-4 py-2 text-xs sm:text-sm'
                style={{
                  padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)",
                  borderRadius: "var(--radius-lg)",
                  background: editing
                    ? "var(--surface-container-high)"
                    : "var(--primary)",
                  color: editing ? "var(--on-surface-variant)" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  boxShadow: editing ? "none" : "0 6px 16px rgba(6,78,59,0.22)",
                  transition: "all 0.2s",
                }}>
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          <Alert
            type='success'
            message={success}
            onClose={() => setSuccess("")}
          />
          <Alert type='error' message={error} onClose={() => setError("")} />

          {editing ? (
            /* ── EDIT FORM ── */
            <form
              noValidate
              onSubmit={handleUpdate}
              className='px-3 sm:px-4 md:px-6'
              style={{ padding: "clamp(16px, 4vw, 28px)" }}>
              {/* Photo */}
              <div className='mb-4 sm:mb-5' style={{ marginBottom: "20px" }}>
                <label
                  className='inp-label text-xs sm:text-sm'
                  style={{ display: "block", marginBottom: "8px" }}>
                  Profile Photo
                  <span
                    style={{
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                      fontSize: "11px",
                      marginLeft: "6px",
                    }}>
                    (click on current image to change it)
                  </span>
                </label>
                <label
                  htmlFor='edit-photo'
                  style={{ cursor: "pointer", display: "inline-block" }}>
                  {preview || cookProfile?.photo ? (
                    <img
                      src={preview || cookProfile?.photo}
                      alt='preview'
                      style={{
                        width: "96px",
                        height: "96px",
                        borderRadius: "var(--radius-lg)",
                        objectFit: "cover",
                        display: "block",
                        border: "2px solid var(--border-light)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "96px",
                        height: "96px",
                        borderRadius: "var(--radius-lg)",
                        border: "2px dashed var(--border-light)",
                        background: "var(--surface-container-high)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}>
                      <span
                        className='material-symbols-outlined'
                        style={{ fontSize: "24px", color: "var(--outline)" }}>
                        add_a_photo
                      </span>
                      <span
                        style={{
                          fontSize: "0.625rem",
                          color: "var(--outline)",
                          fontFamily: "var(--font-body)",
                        }}>
                        Upload
                      </span>
                    </div>
                  )}
                </label>
                <input
                  id='edit-photo'
                  type='file'
                  accept='image/*'
                  onChange={handlePhoto}
                  style={{ display: "none" }}
                />
              </div>

              {/* Bio */}
              <div className='inp-group'>
                <label className='inp-label' htmlFor='bio'>
                  Bio
                </label>
                <div className='inp-icon-wrap'>
                  <span className='material-symbols-outlined inp-icon'>
                    edit_note
                  </span>
                  <textarea
                    className='inp-field'
                    id='bio'
                    type='text'
                    name='bio'
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder='Tell customers about your cooking…'
                    required
                  />
                </div>
              </div>

              {/* Cuisine */}
              <div className='inp-group'>
                <label className='inp-label' htmlFor='cuisineType'>
                  Cuisine Type
                </label>
                <div className='inp-icon-wrap'>
                  <span className='material-symbols-outlined inp-icon'>
                    restaurant
                  </span>
                  <input
                    className='inp-field'
                    id='cuisineType'
                    type='text'
                    name='cuisineType'
                    value={formData.cuisineType}
                    onChange={handleChange}
                    placeholder='e.g. Gujarati, Punjabi'
                    required
                  />
                </div>
              </div>

              {/* City + Address */}
              <div className='inp-row'>
                <div className='inp-group'>
                  <label className='inp-label' htmlFor='city'>
                    City
                  </label>
                  <div className='inp-icon-wrap'>
                    <span className='material-symbols-outlined inp-icon'>
                      location_city
                    </span>
                    <input
                      className='inp-field'
                      id='city'
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      placeholder='Surat'
                      required
                    />
                  </div>
                </div>
                <div className='inp-group'>
                  <label className='inp-label' htmlFor='address'>
                    Address
                  </label>
                  <div className='inp-icon-wrap'>
                    <span className='material-symbols-outlined inp-icon'>
                      home_pin
                    </span>
                    <input
                      className='inp-field'
                      id='address'
                      type='text'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      placeholder='Your full address'
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type='submit'
                className='auth-btn'
                disabled={updating}
                style={{ marginTop: "8px" }}>
                {updating ? "Saving…" : "Save Changes"}
              </button>
            </form>
          ) : (
            /* ── VIEW MODE ── */
            <div
              className='px-3 sm:px-4 md:px-6'
              style={{
                padding: "28px clamp(12px, 4vw, 28px)",
                display: "flex",
                gap: "clamp(20px, 4vw, 28px)",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}>
              {/* Photo */}
              {cookProfile?.photo && (
                <img
                  src={cookProfile.photo}
                  alt='profile'
                  style={{
                    width: "clamp(72px, 20vw, 88px)",
                    height: "clamp(72px, 20vw, 88px)",
                    borderRadius: "var(--radius-lg)",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "2px solid var(--border-light)",
                  }}
                />
              )}

              {/* Info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                  gap: "clamp(20px, 3vw, 48px)",
                  flex: 1,
                  width: "100%",
                  minWidth: "280px",
                }}>
                <div style={{ minWidth: 0 }}>
                  <p style={labelStyle}>
                    <span
                      className='material-symbols-outlined'
                      style={{ fontSize: "13px" }}>
                      edit_note
                    </span>
                    Bio
                  </p>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--on-surface)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}>
                    {cookProfile?.bio || "—"}
                  </p>
                </div>

                {/* ── RIGHT COLUMN: OTHER INFO ── */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(20px, 3vw, 20px)",
                  }}>
                  {[
                    {
                      icon: "restaurant",
                      label: "Cuisine",
                      value: cookProfile?.cuisineType?.join(", "),
                    },
                    {
                      icon: "location_city",
                      label: "City",
                      value: cookProfile?.city,
                    },
                    {
                      icon: "home_pin",
                      label: "Address",
                      value: cookProfile?.address,
                    },
                  ].map(({ icon, label, value }) => (
                    <div key={label}>
                      <p style={labelStyle}>
                        <span
                          className='material-symbols-outlined'
                          style={{ fontSize: "13px" }}>
                          {icon}
                        </span>
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--on-surface)",
                          lineHeight: 1.5,
                        }}>
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ── Small navbar button helper ── */
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
      {icon} <span className='hidden sm:inline'>{label}</span>
    </button>
  );
}

export default CookDashboard;
