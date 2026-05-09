import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { ChefHat, MapPin, Star, Utensils, Clock } from "lucide-react";
import Footer from "../../components/Footer";
import { getTimeRemainingToCutoffInIST } from "../../utils/timeZone";

function CookPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cook, setCook] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState("lunch");

  useEffect(() => {
    const fetchCookData = async () => {
      try {
        const [cookRes, menuRes, reviewRes] = await Promise.all([
          axiosInstance.get(`/cook/${id}`),
          axiosInstance.get(`/menu/today/${id}`),
          axiosInstance.get(`/reviews/cook/${id}`),
        ]);
        setCook(cookRes.data.cookProfile);
        setMenus(menuRes.data.menus);
        setReviews(reviewRes.data.reviews);
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };
    fetchCookData();
  }, [id]);

  const filteredMenus = menus.filter((m) => m.mealType === mealType);

  const getTimeRemaining = (cutoffTime) => {
    return getTimeRemainingToCutoffInIST(cutoffTime);
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
          Loading profile…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div className='dashboard-wrap'>
      <Navbar showBack backPath='/home' backLabel='Home' />

      <div className='dashboard-content'>
        {/* ── Cook Profile Card ── */}
        <div
          className='mb-4 sm:mb-5 md:mb-6'
          style={{
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "0 2px 24px rgba(20,27,43,0.05)",
            marginBottom: "var(--space-md)",
          }}>
          {/* Emerald accent header strip */}
          <div
            style={{
              height: "6px",
              background: "var(--cta-gradient)",
            }}
          />

          <div
            style={{
              padding: "clamp(16px, 4vw, 28px) clamp(12px, 3vw, 24px)",
              display: "flex",
              gap: "clamp(12px, 3vw, 22px)",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}>
            {cook?.photo ? (
              <img
                src={cook.photo}
                alt='cook'
                style={{
                  width: "clamp(80px, 24vw, 108px)",
                  height: "clamp(80px, 24vw, 108px)",
                  borderRadius: "var(--radius-lg)",
                  objectFit: "cover",
                  flexShrink: 0,
                  boxShadow: "0 4px 20px rgba(6,78,59,0.14)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "clamp(80px, 24vw, 108px)",
                  height: "clamp(80px, 24vw, 108px)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--primary-fixed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary-container)",
                  flexShrink: 0,
                }}>
                <ChefHat size={44} />
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.1rem, 4.8vw, 1.5rem)",
                  fontWeight: 900,
                  color: "var(--on-surface)",
                  letterSpacing: "-0.03em",
                  marginBottom: "4px",
                  lineHeight: 1.15,
                }}>
                {cook?.userId?.name}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                  color: "var(--outline)",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}>
                <MapPin size={12} />
                {cook?.address}, {cook?.city}
              </div>

              <div
                style={{
                  fontSize: "clamp(0.78rem, 2.3vw, 0.875rem)",
                  color: "var(--on-surface-variant)",
                  lineHeight: 1.65,
                  marginBottom: "14px",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}>
                {cook?.bio}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}>
                {/* Rating chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#FEF3C7",
                    color: "#92400E",
                    padding: "clamp(3px, 1vw, 4px) clamp(8px, 2.4vw, 10px)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                    fontWeight: 700,
                  }}>
                  <Star size={13} fill='#D97706' color='#D97706' />
                  {cook?.rating || 0}
                  <span style={{ fontWeight: 500, opacity: 0.75 }}>
                    ({cook?.totalReviews || 0} reviews)
                  </span>
                </div>

                {/* Cuisine tags — Emerald Insight Chips */}
                <div className='cook-card-tags'>
                  {cook?.cuisineType?.map((c, i) => (
                    <span key={i} className='cook-tag'>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Meal Type Toggle ── */}
        <div
          style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 10px)",
            marginBottom: "var(--space-md)",
            flexWrap: "wrap",
          }}>
          {["lunch", "dinner"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className='text-xs sm:text-sm'
              style={{
                padding: "clamp(8px, 2vw, 10px) clamp(12px, 4vw, 28px)",
                borderRadius: "var(--radius-lg)",
                border:
                  mealType === type
                    ? "none"
                    : "1.5px solid var(--outline-variant)",
                background:
                  mealType === type
                    ? "var(--cta-gradient)"
                    : "var(--surface-container-lowest)",
                color:
                  mealType === type ? "var(--on-primary)" : "var(--outline)",
                fontWeight: 700,
                fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                textTransform: "capitalize",
                letterSpacing: "0.03em",
                transition: "all 0.2s",
                boxShadow:
                  mealType === type ? "0 4px 16px rgba(6,78,59,0.25)" : "none",
                flex: "1 1 min(100%, 140px)",
              }}>
              {type === "lunch" ? "☀ Lunch" : "🌙 Dinner"}
            </button>
          ))}
        </div>

        {/* ── Today's Menu ── */}
        {filteredMenus.length === 0 ? (
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(44px, 12vw, 56px) clamp(14px, 4vw, 24px)",
              textAlign: "center",
              boxShadow: "0 2px 24px rgba(20,27,43,0.04)",
              marginBottom: "var(--space-md)",
            }}>
            <div
              style={{
                width: "clamp(44px, 12vw, 56px)",
                height: "clamp(44px, 12vw, 56px)",
                borderRadius: "var(--radius-lg)",
                background: "var(--primary-fixed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                color: "var(--primary-container)",
              }}>
              <Utensils size={24} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                fontWeight: 800,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}>
              No {mealType} menu today
            </div>
            <div
              style={{
                fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                color: "var(--outline)",
              }}>
              Check back later or try the dinner menu
            </div>
          </div>
        ) : (
          filteredMenus.map((menu) => (
            <div
              key={menu._id}
              style={{
                background: "var(--surface-container-lowest)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "0 2px 24px rgba(20,27,43,0.05)",
                marginBottom: "var(--space-md)",
              }}>
              {/* Menu header */}
              <div
                style={{
                  padding: "clamp(12px, 3vw, 14px) clamp(14px, 4vw, 22px)",
                  background: "var(--surface-container-low)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "clamp(8px, 2vw, 10px)",
                  flexWrap: "wrap",
                }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.8125rem, 2.4vw, 0.9375rem)",
                    fontWeight: 800,
                    color: "var(--on-surface)",
                    letterSpacing: "-0.02em",
                    textTransform: "capitalize",
                  }}>
                  Today's {mealType} menu
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#FEF3C7",
                    color: "#92400E",
                    padding: "clamp(3px, 1vw, 4px) clamp(8px, 2.4vw, 10px)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}>
                  <Clock size={11} />
                  By {menu.cutoffTime} · {getTimeRemaining(menu.cutoffTime)}
                </span>
              </div>

              {/* Dishes */}
              <div
                style={{
                  padding: "clamp(12px, 3vw, 16px) clamp(14px, 4vw, 22px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(10px, 2vw, 12px)",
                }}>
                {menu.dishes?.map((dish, i) => (
                  <div key={i} className='menu-dish-card'>
                    {dish.photo && (
                      <img
                        src={dish.photo}
                        alt={dish.name}
                        className='menu-dish-image'
                      />
                    )}
                    <div className='menu-dish-body'>
                      <div className='menu-dish-name'>{dish.name}</div>
                      {dish.description && (
                        <div className='menu-dish-desc'>{dish.description}</div>
                      )}
                      <div className='menu-dish-footer'>
                        <div className='menu-dish-price'>₹{dish.price}</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "clamp(8px, 2vw, 10px)",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                          }}>
                          <div className='menu-dish-portions'>
                            {dish.portionsLeft} left
                          </div>
                          {dish.portionsLeft > 0 && (
                            <button
                              onClick={() =>
                                navigate("/orders/place", {
                                  state: {
                                    menuId: menu._id,
                                    dishIndex: i,
                                    dish,
                                  },
                                })
                              }
                              style={{
                                background: "var(--cta-gradient)",
                                color: "var(--on-primary)",
                                border: "none",
                                borderRadius: "var(--radius-lg)",
                                padding:
                                  "clamp(6px, 1.7vw, 7px) clamp(12px, 3.2vw, 16px)",
                                fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "var(--font-display)",
                                letterSpacing: "0.03em",
                                boxShadow: "0 2px 10px rgba(6,78,59,0.2)",
                                transition: "opacity 0.2s",
                              }}>
                              Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* ── Reviews Section ── */}
        {reviews.length > 0 && (
          <div style={{ marginTop: "var(--space-md)" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                fontWeight: 800,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 10px)",
                flexWrap: "wrap",
              }}>
              Reviews
              {/* Count chip */}
              <span
                style={{
                  background: "var(--primary-fixed)",
                  color: "var(--primary-container)",
                  fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                  fontWeight: 700,
                  padding: "clamp(3px, 1vw, 4px) clamp(8px, 2.4vw, 10px)",
                  borderRadius: "var(--radius-pill)",
                  letterSpacing: "0.04em",
                }}>
                {reviews.length}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px, 2vw, 10px)",
              }}>
              {reviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    background: "var(--surface-container-lowest)",
                    borderRadius: "var(--radius-lg)",
                    padding: "clamp(14px, 3.5vw, 18px) clamp(14px, 4vw, 22px)",
                    boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(0.8125rem, 2.4vw, 0.9375rem)",
                        fontWeight: 700,
                        color: "var(--on-surface)",
                        letterSpacing: "-0.01em",
                      }}>
                      {review.customerId?.name}
                    </div>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          color='#D97706'
                          fill='#D97706'
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <div
                      style={{
                        fontSize: "clamp(0.78rem, 2.3vw, 0.875rem)",
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.65,
                        marginBottom: "8px",
                      }}>
                      {review.comment}
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                      color: "var(--outline)",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default CookPublicProfile;
