import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import { validateOrder } from "../../utils/validate";
import { ArrowLeft, Banknote, Minus, Plus } from "lucide-react";

function PlaceOrder() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { menuId, dishIndex, dish } = state || {};

  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalAmount = dish?.price * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateOrder(deliveryAddress);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/orders", {
        menuId,
        dishIndex,
        quantity,
        deliveryAddress,
      });
      setSuccess("Order placed successfully!");
      setTimeout(() => navigate("/orders/my"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='setup-wrap'>
      <div className='setup-card'>
        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className='text-xs sm:text-sm'
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--outline)",
            cursor: "pointer",
            fontSize: "clamp(0.72rem, 2vw, 0.8125rem)",
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            padding: 0,
            marginBottom: "clamp(16px, 4vw, 24px)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--outline)")
          }>
          <ArrowLeft size={15} /> Back
        </button>

        {/* ── Title ── */}
        <div className='setup-title text-2xl sm:text-3xl'>Place Order</div>
        <div className='setup-sub text-sm sm:text-base'>
          Review your details and confirm
        </div>

        {/* ── Dish Summary Card ── */}
        <div
          style={{
            background: "var(--surface-container-low)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(12px, 3vw, 18px)",
            marginBottom: "clamp(16px, 4vw, 24px)",
            display: "flex",
            gap: "clamp(10px, 3vw, 14px)",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}>
          {dish?.photo && (
            <img
              src={dish.photo}
              alt={dish.name}
              style={{
                width: "clamp(56px, 18vw, 72px)",
                height: "clamp(56px, 18vw, 72px)",
                borderRadius: "var(--radius-md)",
                objectFit: "cover",
                flexShrink: 0,
                boxShadow: "0 2px 12px rgba(20,27,43,0.1)",
              }}
            />
          )}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.9375rem, 3vw, 1.0625rem)",
                fontWeight: 800,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}>
              {dish?.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1rem, 3.2vw, 1.125rem)",
                fontWeight: 900,
                color: "var(--primary-container)",
                letterSpacing: "-0.04em",
              }}>
              ₹{dish?.price}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--outline)",
                  letterSpacing: "0",
                  marginLeft: "4px",
                }}>
                per portion
              </span>
            </div>
          </div>
        </div>

        <Alert type='error' message={error} onClose={() => setError("")} />
        <Alert
          type='success'
          message={success}
          onClose={() => setSuccess("")}
        />

        <form noValidate onSubmit={handleSubmit}>
          {/* ── Quantity ── */}
          <div style={{ marginBottom: "22px" }}>
            <div
              className='inp-label'
              style={{
                marginBottom: "12px",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.05em",
              }}>
              QUANTITY
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2.2vw, 12px)",
                flexWrap: "wrap",
              }}>
              {/* Stepper group */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "var(--surface-container-high)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}>
                <button
                  type='button'
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "clamp(36px, 10vw, 40px)",
                    height: "clamp(36px, 10vw, 40px)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      quantity === 1
                        ? "var(--outline)"
                        : "var(--primary-container)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--surface-container)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }>
                  <Minus size={15} strokeWidth={2.5} />
                </button>
                <span
                  style={{
                    minWidth: "clamp(38px, 10vw, 44px)",
                    textAlign: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1rem, 3.4vw, 1.125rem)",
                    fontWeight: 800,
                    color: "var(--on-surface)",
                    letterSpacing: "-0.02em",
                  }}>
                  {quantity}
                </span>
                <button
                  type='button'
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: "clamp(36px, 10vw, 40px)",
                    height: "clamp(36px, 10vw, 40px)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary-container)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--surface-container)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }>
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>

              {/* Running total */}
              <div
                style={{
                  marginLeft: 0,
                  fontSize: "clamp(0.78rem, 2.3vw, 0.875rem)",
                  color: "var(--outline)",
                  minWidth: "unset",
                }}>
                Total:{" "}
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1rem, 3.2vw, 1.125rem)",
                    fontWeight: 900,
                    color: "var(--primary-container)",
                    letterSpacing: "-0.04em",
                  }}>
                  ₹{totalAmount}
                </strong>
              </div>
            </div>
          </div>

          {/* ── Delivery Address ── */}
          <div className='inp-wrap' style={{ marginBottom: "18px" }}>
            <div className='inp-label'>Delivery Address</div>
            <input
              className='inp-field'
              type='text'
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder='Enter your full delivery address'
              required
            />
          </div>

          {/* ── COD Note ── */}
          <div
            style={{
              background: "#FEF3C7",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(12px, 3vw, 14px) clamp(12px, 3.5vw, 16px)",
              marginBottom: "clamp(16px, 4vw, 22px)",
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(8px, 2.5vw, 10px)",
              fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
              color: "#92400E",
              fontWeight: 600,
            }}>
            <div
              style={{
                width: "clamp(28px, 8vw, 32px)",
                height: "clamp(28px, 8vw, 32px)",
                borderRadius: "var(--radius-md)",
                background: "#FDE68A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
              <Banknote size={17} color='#92400E' />
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: "1px" }}>
                Cash on Delivery
              </div>
              <div
                style={{ fontWeight: 500, opacity: 0.8, fontSize: "0.75rem" }}>
                Pay when your food arrives
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type='submit'
            className='auth-btn'
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              width: "100%",
              maxWidth: "100%",
            }}>
            {loading ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Placing order…
              </span>
            ) : (
              `Place Order · ₹${totalAmount}`
            )}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default PlaceOrder;
