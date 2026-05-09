import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import NotificationBell from "../../components/NotificationBell";
import { logout } from "../../redux/slices/authSlice";
import {
  Package,
  Star,
  Inbox,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
  PlusCircle,
  LogOut,
  ChefHat,
  ListOrdered,
  Menu,
  X,
} from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import Footer from "../../components/Footer";

function CookOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pastMenus, setPastMenus] = useState([]);
  const [pastMenusLoading, setPastMenusLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchReviews();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/cook");
      setOrders(data.orders);
    } catch (err) {
      void err;
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const profileRes = await axiosInstance.get("/cook/profile/me");
      const { data } = await axiosInstance.get(
        `/reviews/cook/${profileRes.data.cookProfile._id}`,
      );
      setReviews(data.reviews);
    } catch (err) {
      void err;
    }
  };

  const fetchPastMenus = async () => {
    setPastMenusLoading(true);
    try {
      const { data } = await axiosInstance.get("/menu/history");
      setPastMenus(data.menus);
    } catch (err) {
      void err;
    } finally {
      setPastMenusLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmStatusUpdate.id}/status`, {
        status: confirmStatusUpdate.status,
      });
      setOrders(
        orders.map((o) =>
          o._id === confirmStatusUpdate.id
            ? { ...o, status: confirmStatusUpdate.status }
            : o,
        ),
      );
      setSuccess(`Order marked as ${confirmStatusUpdate.status}!`);
      setConfirmStatusUpdate(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setConfirmStatusUpdate(null);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmCancelId}/status`, {
        status: "cancelled",
      });
      setOrders(
        orders.map((o) =>
          o._id === confirmCancelId ? { ...o, status: "cancelled" } : o,
        ),
      );
      setSuccess("Order cancelled successfully!");
      setConfirmCancelId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const nextStatus = (current) => {
    const flow = {
      confirmed: "preparing",
      preparing: "ready",
      ready: "delivered",
    };
    return flow[current] || null;
  };

  const statusStyle = (status) => {
    const map = {
      confirmed: {
        bg: "var(--primary-fixed)",
        color: "var(--primary-container)",
      },
      preparing: { bg: "#fef3c7", color: "#92400e" },
      ready: {
        bg: "var(--primary-fixed-dim)",
        color: "var(--primary-container)",
      },
      delivered: {
        bg: "var(--primary-fixed)",
        color: "var(--primary-container)",
      },
      cancelled: { bg: "#fee2e2", color: "#991b1b" },
    };
    return (
      map[status] || {
        bg: "var(--surface-container-high)",
        color: "var(--on-surface-variant)",
      }
    );
  };

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
            Loading orders…
          </span>
        </div>
      </div>
    );

  const tabs = [
    {
      id: "orders",
      icon: <Package size={15} />,
      label: `Orders (${orders.length})`,
    },
    {
      id: "reviews",
      icon: <Star size={15} fill='currentColor' />,
      label: `Reviews (${reviews.length})`,
    },
    { id: "pastMenus", icon: <Inbox size={15} />, label: "Past Menus" },
  ];

  return (
    <div>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface)",
          fontFamily: "var(--font-body)",
        }}>
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
            className='text-lg sm:text-xl'
            onClick={() => navigate("/cook/dashboard")}
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
                  navigate("/cook/dashboard");
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
                <ChefHat size={14} /> Cook Dashboard
              </button>
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

        <div
          className='px-3 sm:px-4 md:px-6'
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px clamp(12px, 4vw, 24px) 64px",
          }}>
          {/* Page header */}
          <div className='mb-6 sm:mb-8' style={{ marginBottom: "32px" }}>
            <h1
              className='text-2xl sm:text-3xl md:text-4xl'
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "2rem",
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "6px",
              }}>
              Cook Panel
            </h1>
            <p
              className='text-sm sm:text-base'
              style={{ fontSize: "1rem", color: "var(--on-surface-variant)" }}>
              Manage your orders, reviews and past menus
            </p>
          </div>

          {/* ── TABS ── */}
          <div
            style={{
              display: "flex",
              background: "var(--surface-container-high)",
              borderRadius: "var(--radius-lg)",
              padding: "4px",
              gap: "4px",
              marginBottom: "28px",
              flexWrap: "nowrap",
            }}>
            {tabs.map(({ id, icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    if (id === "pastMenus" && pastMenus.length === 0)
                      fetchPastMenus();
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(4px, 1.2vw, 7px)",
                    padding: "clamp(8px, 2vw, 10px) clamp(8px, 2.6vw, 16px)",
                    borderRadius: "calc(var(--radius-lg) - 2px)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(0.7rem, 1.9vw, 0.875rem)",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                    background: isActive
                      ? "var(--surface-container-lowest)"
                      : "transparent",
                    color: isActive
                      ? "var(--primary-container)"
                      : "var(--on-surface-variant)",
                    boxShadow: isActive
                      ? "0 1px 6px rgba(6,78,59,0.12)"
                      : "none",
                  }}>
                  {icon} {label}
                </button>
              );
            })}
          </div>

          <Alert type='error' message={error} onClose={() => setError("")} />
          <Alert
            type='success'
            message={success}
            onClose={() => setSuccess("")}
          />

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" &&
            (orders.length === 0 ? (
              <EmptyState
                icon={<Inbox size={32} color='var(--outline)' />}
                title='No orders yet'
                sub='Orders will appear here once customers place them'
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}>
                {orders.map((order) => {
                  const { bg, color } = statusStyle(order.status);
                  const next = nextStatus(order.status);
                  return (
                    <div
                      key={order._id}
                      style={{
                        background: "var(--surface-container-lowest)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                        overflow: "hidden",
                      }}>
                      {/* Order header */}
                      <div
                        style={{
                          padding: "18px 22px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          borderBottom:
                            "1px solid var(--surface-container-high)",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}>
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 800,
                              fontSize: "1rem",
                              color: "var(--on-surface)",
                              letterSpacing: "-0.02em",
                              marginBottom: "3px",
                            }}>
                            {order.dish?.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--on-surface-variant)",
                            }}>
                            Qty: {order.quantity} &nbsp;·&nbsp; ₹
                            {order.totalAmount} &nbsp;·&nbsp; COD
                          </p>
                        </div>
                        {/* Status badge */}
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "var(--radius-pill)",
                            background: bg,
                            color,
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            flexShrink: 0,
                          }}>
                          {order.status}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div
                        style={{
                          padding: "14px 22px",
                          borderBottom:
                            "1px solid var(--surface-container-high)",
                        }}>
                        <p
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            color: "var(--on-surface-variant)",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            marginBottom: "8px",
                          }}>
                          Customer
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            color: "var(--on-surface)",
                            marginBottom: "2px",
                          }}>
                          {order.customerId?.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--on-surface-variant)",
                            marginBottom: "6px",
                          }}>
                          {order.customerId?.email}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--on-surface-variant)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}>
                          <MapPin size={13} style={{ flexShrink: 0 }} />
                          {order.deliveryAddress}
                        </p>
                      </div>

                      {/* Footer: timestamp + actions */}
                      <div
                        style={{
                          padding: "12px 22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--on-surface-variant)",
                          }}>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                          )}{" "}
                          at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}>
                          {next && (
                            <button
                              onClick={() =>
                                setConfirmStatusUpdate({
                                  id: order._id,
                                  status: next,
                                })
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                borderRadius: "var(--radius-lg)",
                                background: "var(--primary-fixed)",
                                color: "var(--primary-container)",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "0.8125rem",
                                transition: "background 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "var(--primary-fixed-dim)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "var(--primary-fixed)")
                              }>
                              Mark as {next} <ArrowRight size={13} />
                            </button>
                          )}

                          {["confirmed", "preparing"].includes(
                            order.status,
                          ) && (
                            <button
                              onClick={() => setConfirmCancelId(order._id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                borderRadius: "var(--radius-lg)",
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "0.8125rem",
                              }}>
                              Cancel Order
                            </button>
                          )}

                          {order.status === "delivered" && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "0.8125rem",
                                fontWeight: 700,
                                color: "var(--primary-container)",
                              }}>
                              <CheckCircle2 size={15} /> Delivered
                            </span>
                          )}

                          {order.status === "cancelled" && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "0.8125rem",
                                fontWeight: 700,
                                color: "#991b1b",
                              }}>
                              <XCircle size={15} /> Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* ── REVIEWS TAB ── */}
          {activeTab === "reviews" &&
            (reviews.length === 0 ? (
              <EmptyState
                icon={
                  <Star
                    size={32}
                    fill='var(--outline)'
                    color='var(--outline)'
                  />
                }
                title='No reviews yet'
                sub='Reviews will appear here once customers rate your food'
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    style={{
                      background: "var(--surface-container-lowest)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                      padding: "20px 24px",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                      }}>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "0.9375rem",
                          color: "var(--on-surface)",
                          letterSpacing: "-0.01em",
                        }}>
                        {review.customerId?.name}
                      </p>
                      {/* Star rating */}
                      <div style={{ display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={i < review.rating ? "#b45309" : "none"}
                            color={
                              i < review.rating
                                ? "#b45309"
                                : "var(--border-light)"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--on-surface-variant)",
                          lineHeight: 1.7,
                          marginBottom: "10px",
                          paddingLeft: "12px",
                          borderLeft: "3px solid var(--primary-fixed-dim)",
                        }}>
                        {review.comment}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--on-surface-variant)",
                        opacity: 0.7,
                      }}>
                      {new Date(review.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                ))}
              </div>
            ))}

          {/* ── PAST MENUS TAB ── */}
          {activeTab === "pastMenus" &&
            (pastMenusLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "56px",
                  color: "var(--on-surface-variant)",
                  fontSize: "0.875rem",
                }}>
                Loading past menus…
              </div>
            ) : pastMenus.length === 0 ? (
              <EmptyState
                icon={<Inbox size={32} color='var(--outline)' />}
                title='No past menus'
                sub='Your expired and past menus will appear here'
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                {pastMenus.map((menu) => (
                  <div
                    key={menu._id}
                    className='overflow-hidden'
                    style={{
                      background: "var(--surface-container-lowest)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "0 8px 28px rgba(20,27,43,0.06)",
                      border: "1px solid rgba(20,27,43,0.08)",
                      overflow: "hidden",
                    }}>
                    {/* Menu header */}
                    <div
                      className='flex flex-col sm:flex-row gap-2 sm:gap-3'
                      style={{
                        padding:
                          "clamp(12px, 3vw, 14px) clamp(14px, 4vw, 20px)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        background:
                          "linear-gradient(180deg, rgba(6,78,59,0.06) 0%, rgba(6,78,59,0.02) 100%)",
                        borderBottom: "1px solid var(--surface-container-high)",
                        flexWrap: "wrap",
                        gap: "8px",
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
                          fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                          color: "var(--on-surface-variant)",
                        }}>
                        {new Date(menu.date).toLocaleDateString("en-GB")} ·
                        cutoff {menu.cutoffTime}
                      </span>
                    </div>

                    {/* Dish tags */}
                    <div
                      style={{
                        padding:
                          "clamp(10px, 2.8vw, 12px) clamp(14px, 4vw, 20px)",
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}>
                      {menu.dishes?.map((d, i) => (
                        <span
                          key={i}
                          style={{
                            padding:
                              "clamp(3px, 1vw, 4px) clamp(9px, 2.4vw, 12px)",
                            borderRadius: "var(--radius-pill)",
                            background: "var(--surface-container-high)",
                            color: "var(--on-surface-variant)",
                            fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                          }}>
                          {d.name} · ₹{d.price} ·{" "}
                          {d.maxPortions - d.portionsLeft}/{d.maxPortions} sold
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>

        {confirmCancelId && (
          <ConfirmDialog
            message='Are you sure you want to cancel this order?'
            confirmLabel='Cancel Order'
            confirmColor='#DC2626'
            onConfirm={handleCancelOrder}
            onCancel={() => setConfirmCancelId(null)}
          />
        )}
        {confirmStatusUpdate && (
          <ConfirmDialog
            message={`Mark this order as ${confirmStatusUpdate.status}?`}
            confirmLabel={`Mark as ${confirmStatusUpdate.status}`}
            confirmColor='#059669'
            onConfirm={handleStatusUpdate}
            onCancel={() => setConfirmStatusUpdate(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

/* ── Reusable empty state ── */
function EmptyState({ icon, title, sub }) {
  return (
    <div
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
        padding: "105px 32px",
        textAlign: "center",
      }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "var(--surface-container-high)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}>
        {icon}
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1rem",
          color: "var(--on-surface)",
          letterSpacing: "-0.02em",
          marginBottom: "6px",
        }}>
        {title}
      </p>
      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
        {sub}
      </p>
    </div>
  );
}

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

export default CookOrders;
