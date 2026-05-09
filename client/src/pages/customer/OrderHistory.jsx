import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";
import { validateReview } from "../../utils/validate";
import Footer from "../../components/Footer";
import {
  Utensils,
  MapPin,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/my");
      setOrders(data.orders);
    } catch (err) {
      void err;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await axiosInstance.put(`/orders/${confirmCancelId}/cancel`);
      setOrders(
        orders.map((o) =>
          o._id === confirmCancelId ? { ...o, status: "cancelled" } : o,
        ),
      );
      setConfirmCancelId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel order");
    }
  };

  const handleReview = async (orderId) => {
    const validationError = validateReview(reviewData.rating);
    if (validationError) return alert(validationError);
    try {
      await axiosInstance.post("/reviews", {
        orderId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, isReviewed: true } : o)),
      );
      setReviewingId(null);
      setReviewData({ rating: 5, comment: "" });
      setReviewSuccess("Review submitted!");
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const statusConfig = (status) => {
    const map = {
      confirmed: {
        bg: "var(--primary-fixed)",
        color: "var(--primary-container)",
        label: "Confirmed",
      },
      preparing: { bg: "#FEF3C7", color: "#92400E", label: "Preparing" },
      ready: {
        bg: "var(--tertiary-fixed)",
        color: "var(--tertiary)",
        label: "Ready",
      },
      delivered: {
        bg: "var(--primary-fixed)",
        color: "var(--primary-container)",
        label: "Delivered",
      },
      cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "Cancelled" },
      pending: {
        bg: "var(--surface-container-high)",
        color: "var(--outline)",
        label: "Pending",
      },
    };
    return map[status] || map.pending;
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--surface)",
          gap: "12px",
        }}>
        <span
          style={{
            width: "22px",
            height: "22px",
            border: "2px solid var(--primary-fixed-dim)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <div style={{ fontSize: "0.8125rem", color: "var(--outline)" }}>
          Loading orders…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div>
      <div className='dashboard-wrap'>
        <Navbar showBack backPath='/home' backLabel='Home' />

        <div className='dashboard-content'>
          {/* ── Page Header ── */}
          <div
            className='mb-6 sm:mb-8'
            style={{ marginBottom: "var(--space-lg)" }}>
            <div
              className='dashboard-title text-2xl sm:text-3xl'
              style={{ marginBottom: "6px" }}>
              My Orders
            </div>
            <div className='dashboard-subtitle text-sm sm:text-base'>
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </div>
          </div>

          {reviewSuccess && (
            <Alert
              type='success'
              message={reviewSuccess}
              onClose={() => setReviewSuccess("")}
            />
          )}

          {orders.length === 0 ? (
            <div
              style={{
                background: "var(--surface-container-lowest)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(44px, 12vw, 115px) clamp(14px, 4vw, 24px)",
                textAlign: "center",
                boxShadow: "0 2px 24px rgba(20,27,43,0.04)",
              }}>
              <div
                style={{
                  width: "clamp(48px, 12vw, 64px)",
                  height: "clamp(48px, 12vw, 64px)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--primary-fixed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "var(--primary-container)",
                }}>
                <Utensils size={28} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(0.95rem, 2.8vw, 1.125rem)",
                  fontWeight: 800,
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}>
                No orders yet
              </div>
              <div
                style={{
                  fontSize: "clamp(0.75rem, 2.2vw, 0.875rem)",
                  color: "var(--outline)",
                  marginBottom: "28px",
                }}>
                Browse cooks and place your first order!
              </div>
              <button
                className='auth-btn'
                style={{
                  width: "min(100%, 240px)",
                  padding: "clamp(10px, 2.8vw, 12px) clamp(18px, 6vw, 32px)",
                }}
                onClick={() => navigate("/home")}>
                Browse Cooks
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(10px, 2.8vw, 14px)",
              }}>
              {orders.map((order) => {
                const sc = statusConfig(order.status);
                return (
                  <div
                    key={order._id}
                    style={{
                      background: "var(--surface-container-lowest)",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      boxShadow: "0 2px 24px rgba(20,27,43,0.05)",
                    }}>
                    <div
                      style={{
                        padding:
                          "clamp(14px, 4vw, 20px) clamp(14px, 4.5vw, 24px)",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "clamp(10px, 3vw, 16px)",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}>
                        {order.dish?.photo && (
                          <img
                            src={order.dish.photo}
                            alt={order.dish.name}
                            style={{
                              width: "clamp(62px, 18vw, 76px)",
                              height: "clamp(62px, 18vw, 76px)",
                              borderRadius: "var(--radius-lg)",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Title + Status */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "6px",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}>
                            <div
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(0.875rem, 2.6vw, 1rem)",
                                fontWeight: 800,
                                color: "var(--on-surface)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                                overflowWrap: "anywhere",
                              }}>
                              {order.dish?.name}
                            </div>
                            <span
                              style={{
                                background: sc.bg,
                                color: sc.color,
                                fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                                fontWeight: 700,
                                padding:
                                  "clamp(3px, 1vw, 4px) clamp(8px, 2.4vw, 10px)",
                                borderRadius: "var(--radius-pill)",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}>
                              {sc.label}
                            </span>
                          </div>

                          {/* Meta */}
                          <div
                            style={{
                              fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                              color: "var(--outline)",
                              marginBottom: "4px",
                              lineHeight: 1.5,
                              overflowWrap: "anywhere",
                            }}>
                            Qty: {order.quantity} ·{" "}
                            <strong
                              style={{ color: "var(--primary-container)" }}>
                              ₹{order.totalAmount}
                            </strong>{" "}
                            · COD
                          </div>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                              color: "var(--outline)",
                              marginBottom: "6px",
                              maxWidth: "100%",
                              overflowWrap: "anywhere",
                            }}>
                            <MapPin size={11} />
                            {order.deliveryAddress}
                          </div>
                          <div
                            style={{
                              fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                              color: "var(--outline)",
                              fontWeight: 500,
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              lineHeight: 1.5,
                            }}>
                            {new Date(order.createdAt).toLocaleDateString()} at{" "}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>

                          {/* Actions */}
                          <div
                            style={{
                              display: "flex",
                              gap: "clamp(8px, 2vw, 10px)",
                              marginTop: "12px",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}>
                            {["confirmed", "pending"].includes(
                              order.status,
                            ) && (
                              <button
                                onClick={() => setConfirmCancelId(order._id)}
                                className='btn-reject'
                                style={{ margin: 0 }}>
                                Cancel Order
                              </button>
                            )}

                            {order.status === "delivered" &&
                              !order.isReviewed && (
                                <button
                                  onClick={() => setReviewingId(order._id)}
                                  className='btn-approve'>
                                  <Star
                                    size={13}
                                    style={{
                                      display: "inline",
                                      verticalAlign: "-2px",
                                      marginRight: "5px",
                                    }}
                                  />
                                  Leave Review
                                </button>
                              )}

                            {order.isReviewed && (
                              <button
                                onClick={() =>
                                  setExpandedReviewId(
                                    expandedReviewId === order._id
                                      ? null
                                      : order._id,
                                  )
                                }
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "var(--primary-fixed)",
                                  color: "var(--primary-container)",
                                  border: "none",
                                  borderRadius: "var(--radius-lg)",
                                  padding:
                                    "clamp(6px, 1.7vw, 7px) clamp(12px, 3.2vw, 14px)",
                                  fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontFamily: "var(--font-display)",
                                  letterSpacing: "0.02em",
                                }}>
                                <CheckCircle2 size={13} />
                                Reviewed
                                {expandedReviewId === order._id ? (
                                  <ChevronUp size={12} />
                                ) : (
                                  <ChevronDown size={12} />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Expanded Review */}
                          {expandedReviewId === order._id && order.review && (
                            <div
                              style={{
                                marginTop: "12px",
                                padding:
                                  "clamp(12px, 3vw, 14px) clamp(12px, 3.5vw, 16px)",
                                background: "var(--primary-fixed)",
                                borderRadius: "var(--radius-lg)",
                              }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "3px",
                                  marginBottom: "6px",
                                }}>
                                {Array.from({
                                  length: order.review.rating,
                                }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    color='#D97706'
                                    fill='#D97706'
                                  />
                                ))}
                              </div>
                              {order.review.comment && (
                                <div
                                  style={{
                                    fontSize: "clamp(0.78rem, 2.3vw, 0.875rem)",
                                    color: "var(--on-surface-variant)",
                                    lineHeight: 1.6,
                                    overflowWrap: "anywhere",
                                  }}>
                                  {order.review.comment}
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                                  color: "var(--primary-container)",
                                  marginTop: "6px",
                                  fontWeight: 600,
                                  letterSpacing: "0.04em",
                                  textTransform: "uppercase",
                                }}>
                                {new Date(
                                  order.review.createdAt,
                                ).toLocaleDateString("en-GB")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Form */}
                      {reviewingId === order._id && (
                        <div
                          style={{
                            marginTop: "clamp(14px, 4vw, 20px)",
                            background: "var(--surface-container-low)",
                            borderRadius: "var(--radius-lg)",
                            padding: "clamp(14px, 4vw, 20px)",
                          }}>
                          {/* Star Rating */}
                          <div
                            style={{ marginBottom: "clamp(12px, 3vw, 16px)" }}>
                            <div
                              className='inp-label'
                              style={{
                                marginBottom: "10px",
                                fontFamily: "var(--font-display)",
                                letterSpacing: "0.05em",
                              }}>
                              RATING
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  onClick={() =>
                                    setReviewData({
                                      ...reviewData,
                                      rating: star,
                                    })
                                  }
                                  style={{
                                    cursor: "pointer",
                                    opacity:
                                      star <= reviewData.rating ? 1 : 0.25,
                                    transition: "opacity 0.15s, transform 0.1s",
                                    transform:
                                      star <= reviewData.rating
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                    display: "inline-flex",
                                  }}>
                                  <Star
                                    size={26}
                                    fill='#D97706'
                                    stroke='#D97706'
                                  />
                                </span>
                              ))}
                            </div>
                          </div>

                          <div
                            className='inp-wrap'
                            style={{ marginBottom: "clamp(12px, 3vw, 16px)" }}>
                            <div className='inp-label'>Comment (optional)</div>
                            <input
                              className='inp-field'
                              type='text'
                              value={reviewData.comment}
                              onChange={(e) =>
                                setReviewData({
                                  ...reviewData,
                                  comment: e.target.value,
                                })
                              }
                              placeholder='How was the food?'
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}>
                            <button
                              className='btn-approve'
                              style={{ margin: 0 }}
                              onClick={() => handleReview(order._id)}>
                              Submit Review
                            </button>
                            <button
                              onClick={() => setReviewingId(null)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--outline)",
                                cursor: "pointer",
                                fontSize: "0.8125rem",
                                fontFamily: "var(--font-body)",
                              }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {confirmCancelId && (
          <ConfirmDialog
            message='Are you sure you want to cancel this order?'
            confirmLabel='Cancel Order'
            confirmColor='#DC2626'
            onConfirm={handleCancel}
            onCancel={() => setConfirmCancelId(null)}
          />
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
      <Footer />
    </div>
  );
}

export default OrderHistory;
