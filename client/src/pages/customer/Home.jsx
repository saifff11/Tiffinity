import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import {
  getNowPartsInIST,
  getTimeRemainingToCutoffInIST,
} from "../../utils/timeZone";
import {
  Utensils,
  MapPin,
  ChefHat,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/menu/all?mealType=${mealType}`,
        );
        setMenus(data.menus);
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [mealType]);

  const getHour = getNowPartsInIST().hour;
  const greeting =
    getHour < 12 ? "Morning" : getHour < 17 ? "Afternoon" : "Evening";

  const getTimeRemaining = (cutoffTime) => {
    return getTimeRemainingToCutoffInIST(cutoffTime);
  };

  return (
    <div className='dashboard-wrap'>
      <Navbar />

      <div className='dashboard-content'>
        {/* ── Greeting Header ── */}
        <div
          className='mb-4 sm:mb-6 md:mb-8'
          style={{ marginBottom: "var(--space-lg)" }}>
          <div
            className='dashboard-title text-2xl sm:text-3xl'
            style={{ marginBottom: "6px" }}>
            Good {greeting},<br />
            <span style={{ color: "var(--primary)" }}>
              {user?.name?.split(" ")[0]}
            </span>
          </div>
          <div className='dashboard-subtitle text-sm sm:text-base'>
            Fresh meals available today
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

        {/* ── States ── */}
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(48px, 12vw, 80px) 0",
              color: "var(--outline)",
              fontSize: "clamp(0.75rem, 2.2vw, 0.875rem)",
              fontFamily: "var(--font-body)",
              gap: "clamp(8px, 2vw, 10px)",
            }}>
            <span
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid var(--primary-fixed-dim)",
                borderTopColor: "var(--primary)",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }}
            />
            Loading menus…
          </div>
        ) : menus.length === 0 ? (
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(56px, 16vw, 110px) clamp(14px, 4vw, 24px)",
              textAlign: "center",
              boxShadow: "0 2px 24px rgba(20,27,43,0.04)",
            }}>
            <div
              style={{
                width: "clamp(52px, 12vw, 64px)",
                height: "clamp(52px, 12vw, 64px)",
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
                fontSize: "clamp(0.875rem, 2.6vw, 1rem)",
                fontWeight: 800,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}>
              No {mealType} menus right now
            </div>
            <div
              style={{
                fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                color: "var(--outline)",
              }}>
              Check back later or try switching meal type
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(14px, 3vw, 20px)",
            }}>
            {menus.map((menu) => (
              <div
                key={menu._id}
                style={{
                  background: "var(--surface-container-lowest)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "0 2px 24px rgba(20,27,43,0.05)",
                }}>
                <div
                  style={{
                    padding: "clamp(14px, 3.5vw, 18px) clamp(14px, 4vw, 22px)",
                    background: "var(--surface-container-low)",
                  }}>
                  {/* ── Cook Header ── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "clamp(8px, 2vw, 10px)",
                      flexWrap: "wrap",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "clamp(10px, 2.5vw, 14px)",
                      }}>
                      {menu.cookId?.photo ? (
                        <img
                          src={menu.cookId.photo}
                          alt='cook'
                          style={{
                            width: "clamp(40px, 12vw, 48px)",
                            height: "clamp(40px, 12vw, 48px)",
                            borderRadius: "var(--radius-lg)",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "clamp(40px, 12vw, 48px)",
                            height: "clamp(40px, 12vw, 48px)",
                            borderRadius: "var(--radius-lg)",
                            background: "var(--primary-fixed)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary-container)",
                            flexShrink: 0,
                          }}>
                          <ChefHat size={22} />
                        </div>
                      )}
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(0.8125rem, 2.3vw, 0.9375rem)",
                            fontWeight: 800,
                            color: "var(--on-surface)",
                            letterSpacing: "-0.02em",
                            marginBottom: "4px",
                          }}>
                          {menu.cookId?.userId?.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "clamp(8px, 2vw, 12px)",
                            fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                            color: "var(--outline)",
                            flexWrap: "wrap",
                          }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "#D97706",
                              fontWeight: 600,
                            }}>
                            <Star size={12} fill='#D97706' color='#D97706' />
                            {menu.cookId?.rating || 0}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}>
                            <MapPin size={11} />
                            {menu.cookId?.city}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              background: "#FEF3C7",
                              color: "#92400E",
                              padding:
                                "clamp(2px, 1vw, 3px) clamp(7px, 2vw, 8px)",
                              borderRadius: "var(--radius-pill)",
                              fontWeight: 600,
                              fontSize: "clamp(0.62rem, 1.8vw, 0.6875rem)",
                              letterSpacing: "0.02em",
                            }}>
                            <Clock size={11} />
                            Order by {menu.cutoffTime} ·{" "}
                            {getTimeRemaining(menu.cutoffTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/cook/${menu.cookId?._id}`)}
                      className='w-full sm:w-auto justify-center'
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                        color: "var(--primary)",
                        fontWeight: 700,
                        background: "var(--primary-fixed)",
                        border: "none",
                        borderRadius: "var(--radius-lg)",
                        padding:
                          "clamp(6px, 1.7vw, 7px) clamp(10px, 3vw, 14px)",
                        cursor: "pointer",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.02em",
                        transition: "background 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--primary-fixed-dim)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "var(--primary-fixed)")
                      }>
                      View Profile <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* ── Dishes ── */}
                  <div
                    style={{
                      marginTop: "clamp(10px, 2.2vw, 12px)",
                      paddingTop: "clamp(10px, 2.2vw, 12px)",
                      borderTop: "1px solid var(--surface-container-high)",
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
                            <div className='menu-dish-desc'>
                              {dish.description}
                            </div>
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
                                    padding: "7px 16px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "var(--font-display)",
                                    letterSpacing: "0.03em",
                                    boxShadow: "0 2px 10px rgba(6,78,59,0.2)",
                                    transition: "opacity 0.2s",
                                    whiteSpace: "nowrap",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.opacity = "0.88")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.opacity = "1")
                                  }>
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
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Home;
