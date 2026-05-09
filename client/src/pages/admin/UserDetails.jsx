import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { MapPin, Phone, Star } from "lucide-react";
import Footer from "../../components/Footer";

/* ── small reusable helpers ───────────────────────────── */

const Field = ({ label, value }) => (
  <div>
    <div
      className='stat-card-label'
      style={{
        marginBottom: "4px",
        fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
      }}>
      {label}
    </div>
    <div
      style={{
        fontSize: "clamp(0.8rem, 2vw, 0.9375rem)",
        color: "var(--on-surface)",
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        lineHeight: 1.5,
      }}>
      {value ?? <span style={{ color: "var(--outline)" }}>N/A</span>}
    </div>
  </div>
);

const SectionHeader = ({ title, meta }) => (
  <div className='table-card-header'>
    <div
      className='table-card-title'
      style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.125rem)" }}>
      {title}
    </div>
    {meta && (
      <div
        style={{
          fontSize: "clamp(0.72rem, 1.8vw, 0.8125rem)",
          color: "var(--outline)",
          fontFamily: "var(--font-body)",
        }}>
        {meta}
      </div>
    )}
  </div>
);

const statusClass = (status) => {
  if (["delivered", "paid"].includes(status)) return "badge-verified";
  if (["cancelled"].includes(status)) return "badge-rejected";
  return "badge-pending";
};

const Avatar = ({ src, name, size = 48, radius = "var(--radius-lg)" }) =>
  src ? (
    <img
      src={src}
      alt={name}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "var(--primary-fixed)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        color: "var(--primary-container)",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        flexShrink: 0,
      }}>
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );

/* ── main component ───────────────────────────────────── */

function UserDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/admin/users/${id}`);
        setData(res.data.data);
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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
            fontSize: "0.875rem",
            color: "var(--outline)",
            fontFamily: "var(--font-body)",
          }}>
          Loading…
        </div>
      </div>
    );

  if (!data)
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
            fontSize: "0.875rem",
            color: "var(--outline)",
            fontFamily: "var(--font-body)",
          }}>
          No data found.
        </div>
      </div>
    );

  const { user, cookProfile, orders, cookData, reviews, notifications } = data;
  const isCook = user.role === "cook";
  const cookReceivedReviews = cookData?.receivedReviews ?? [];
  const statsSource = isCook ? cookData?.stats : orders?.stats;
  const totalOrdersCount = statsSource?.totalOrders ?? statsSource?.total ?? 0;
  const deliveredOrdersCount =
    statsSource?.deliveredOrders ?? statsSource?.delivered ?? 0;
  const cancelledOrdersCount =
    statsSource?.cancelledOrders ?? statsSource?.cancelled ?? 0;
  const compactStatsGridStyle = {
    marginBottom: "clamp(16px, 3vw, 28px)",
  };
  const compactStatCardStyle = {
    padding: "clamp(10px, 2.4vw, 14px) clamp(10px, 2.8vw, 14px)",
    minHeight: "unset",
  };
  const compactStatLabelStyle = {
    fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)",
    marginBottom: "clamp(4px, 1.2vw, 6px)",
    letterSpacing: "0.03em",
  };
  const compactStatValueStyle = {
    fontSize: "clamp(1.05rem, 3.6vw, 1.35rem)",
    lineHeight: 1.1,
  };

  return (
    <div>
      <div className='dashboard-wrap'>
        <Navbar showBack backPath='/admin/dashboard' backLabel='Dashboard' />

        <div
          className='dashboard-content'
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            paddingBottom: "48px",
          }}>
          {/* PROFILE HERO */}
          <div
            className='stat-card'
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(16px, 3vw, 24px)",
              marginBottom: "clamp(18px, 4vw, 28px)",
              flexWrap: "wrap",
              padding: "clamp(16px, 4vw, 28px)",
            }}>
            <Avatar
              src={user.avatar || cookProfile?.photo}
              name={user.name}
              size={80}
              radius='50%'
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(8px, 2vw, 10px)",
                  flexWrap: "wrap",
                  marginBottom: "6px",
                }}>
                <div
                  className='dashboard-title'
                  style={{
                    marginBottom: 0,
                    fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                  }}>
                  {user.name}
                </div>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
                <span
                  className={`badge ${user.isActive ? "badge-verified" : "badge-rejected"}`}>
                  {user.isActive ? "Active" : "Banned"}
                </span>
                {user.isVerified && (
                  <span className='badge badge-verified'>Email Verified</span>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "clamp(12px, 3vw, 20px)",
                  flexWrap: "wrap",
                }}>
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                    color: "var(--outline)",
                    fontFamily: "var(--font-body)",
                  }}>
                  {user.email}
                </span>
                {user.phone && (
                  <span
                    style={{
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      color: "var(--outline)",
                      fontFamily: "var(--font-body)",
                    }}>
                    <Phone
                      size={13}
                      style={{ display: "inline", marginBottom: "3px" }}
                    />{" "}
                    {user.phone}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                    color: "var(--outline)",
                    fontFamily: "var(--font-body)",
                  }}>
                  <MapPin
                    size={13}
                    style={{ display: "inline", marginBottom: "3px" }}
                  />{" "}
                  {user.city}
                </span>
                <span
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                    color: "var(--outline)",
                    fontFamily: "var(--font-body)",
                  }}>
                  Joined:{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-in", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════════ */}
          <div
            className='stats-grid user-details-stats-grid'
            style={compactStatsGridStyle}>
            <div className='stat-card' style={compactStatCardStyle}>
              <div className='stat-card-label' style={compactStatLabelStyle}>
                Total Orders
              </div>
              <div className='stat-card-value' style={compactStatValueStyle}>
                {totalOrdersCount}
              </div>
            </div>
            <div className='stat-card' style={compactStatCardStyle}>
              <div className='stat-card-label' style={compactStatLabelStyle}>
                Delivered
              </div>
              <div
                className='stat-card-value green'
                style={compactStatValueStyle}>
                {deliveredOrdersCount}
              </div>
            </div>
            <div className='stat-card' style={compactStatCardStyle}>
              <div className='stat-card-label' style={compactStatLabelStyle}>
                Cancelled
              </div>
              <div
                className='stat-card-value amber'
                style={compactStatValueStyle}>
                {cancelledOrdersCount}
              </div>
            </div>
            {isCook && (
              <>
                <div className='stat-card' style={compactStatCardStyle}>
                  <div
                    className='stat-card-label'
                    style={compactStatLabelStyle}>
                    Total Earnings
                  </div>
                  <div
                    className='stat-card-value green'
                    style={compactStatValueStyle}>
                    ₹{cookProfile?.earnings?.total ?? 0}
                  </div>
                </div>
                <div className='stat-card' style={compactStatCardStyle}>
                  <div
                    className='stat-card-label'
                    style={compactStatLabelStyle}>
                    This Month
                  </div>
                  <div
                    className='stat-card-value'
                    style={compactStatValueStyle}>
                    ₹{cookProfile?.earnings?.thisMonth ?? 0}
                  </div>
                </div>
                <div className='stat-card' style={compactStatCardStyle}>
                  <div
                    className='stat-card-label'
                    style={compactStatLabelStyle}>
                    This Week
                  </div>
                  <div
                    className='stat-card-value'
                    style={compactStatValueStyle}>
                    ₹{cookProfile?.earnings?.thisWeek ?? 0}
                  </div>
                </div>
                <div className='stat-card' style={compactStatCardStyle}>
                  <div
                    className='stat-card-label'
                    style={compactStatLabelStyle}>
                    Rating
                  </div>
                  <div
                    className='stat-card-value'
                    style={compactStatValueStyle}>
                    <Star
                      size={20}
                      style={{ display: "inline", marginBottom: "2px" }}
                    />{" "}
                    {cookProfile?.rating ?? "—"}
                  </div>
                </div>
                <div className='stat-card' style={compactStatCardStyle}>
                  <div
                    className='stat-card-label'
                    style={compactStatLabelStyle}>
                    Total Reviews
                  </div>
                  <div
                    className='stat-card-value'
                    style={compactStatValueStyle}>
                    {cookProfile?.totalReviews ?? 0}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ══════════════════════════════════════════
            COOK PROFILE (cook only)
        ══════════════════════════════════════════ */}
          {isCook && cookProfile && (
            <div className='table-card' style={{ marginBottom: "28px" }}>
              <SectionHeader
                title='Cook Profile'
                meta={
                  <span style={{ display: "flex", gap: "6px" }}>
                    <span
                      className={`badge ${cookProfile.isVerified ? "badge-verified" : "badge-rejected"}`}>
                      {cookProfile.isVerified ? "Verified" : "Unverified"}
                    </span>
                    <span
                      className={`badge ${cookProfile.isAvailable ? "badge-verified" : "badge-pending"}`}>
                      {cookProfile.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </span>
                }
              />
              <div
                style={{
                  padding: "28px",
                  display: "flex",
                  gap: "28px",
                  flexWrap: "wrap",
                }}>
                {cookProfile.photo && (
                  <img
                    src={cookProfile.photo}
                    alt='cook'
                    style={{
                      width: "clamp(88px, 25vw, 120px)",
                      height: "clamp(88px, 25vw, 120px)",
                      borderRadius: "var(--radius-lg)",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "clamp(16px, 3vw, 24px)",
                  }}>
                  <Field label='City' value={cookProfile.city} />
                  <Field label='Address' value={cookProfile.address} />
                  <Field
                    label='Cuisine Types'
                    value={cookProfile.cuisineType?.join(", ")}
                  />
                </div>
              </div>
              {cookProfile.bio && (
                <div style={{ padding: "0 28px 28px" }}>
                  <div
                    className='stat-card-label'
                    style={{ marginBottom: "8px" }}>
                    Bio
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(0.8rem, 2vw, 0.9375rem)",
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.7,
                      fontFamily: "var(--font-body)",
                      background: "var(--surface-container-low)",
                      borderRadius: "var(--radius-lg)",
                      padding: "clamp(14px, 3vw, 16px) clamp(16px, 4vw, 20px)",
                    }}>
                    {cookProfile.bio}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
            ORDERS PLACED (as customer)
        ══════════════════════════════════════════ */}
          {!isCook && (
            <div className='table-card' style={{ marginBottom: "28px" }}>
              <SectionHeader
                title='Orders Placed'
                meta={`Last ${orders.recent.length}`}
              />

              {orders.recent.length === 0 ? (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "var(--outline)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                  }}>
                  No orders placed yet
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Dish</th>
                      <th>Cook</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.recent.map((o) => (
                      <tr key={o._id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}>
                            {o.dish?.photo ? (
                              <img
                                src={o.dish.photo}
                                alt={o.dish.name}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "var(--radius-md)",
                                  objectFit: "cover",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "var(--radius-md)",
                                  background: "var(--primary-fixed)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  flexShrink: 0,
                                }}>
                                🍽️
                              </div>
                            )}
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "var(--on-surface)",
                                  fontSize: "0.875rem",
                                  fontFamily: "var(--font-display)",
                                }}>
                                {o.dish?.name || "N/A"}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--outline)",
                                }}>
                                ₹{o.dish?.price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--on-surface-variant)",
                          }}>
                          {o.cookId?.userId?.name || "N/A"}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            fontWeight: 600,
                            color: "var(--on-surface)",
                          }}>
                          {o.quantity}
                        </td>
                        <td
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            color: "var(--primary-container)",
                          }}>
                          ₹{o.totalAmount}
                        </td>
                        <td>
                          <span className={`badge ${statusClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${statusClass(o.paymentStatus)}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "var(--outline)",
                            fontSize: "0.8125rem",
                          }}>
                          {new Date(o.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
            ORDERS RECEIVED (cook only)
        ══════════════════════════════════════════ */}
          {isCook && (
            <div
              className='table-card'
              style={{
                marginBottom: "clamp(20px, 4vw, 28px)",
                width: "",
              }}>
              <SectionHeader
                title='Orders Received'
                meta={`Last ${cookData.orders?.length ?? 0}`}
              />

              {!cookData.orders?.length ? (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "var(--outline)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                  }}>
                  No orders received yet
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Dish</th>
                      <th>Customer</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Delivery Address</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookData.orders.map((o) => (
                      <tr key={o._id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}>
                            {o.dish?.photo ? (
                              <img
                                src={o.dish.photo}
                                alt={o.dish.name}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "var(--radius-md)",
                                  objectFit: "cover",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "var(--radius-md)",
                                  background: "var(--primary-fixed)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  flexShrink: 0,
                                }}>
                                🍽️
                              </div>
                            )}
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "var(--on-surface)",
                                  fontSize: "0.875rem",
                                  fontFamily: "var(--font-display)",
                                }}>
                                {o.dish?.name || "N/A"}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--outline)",
                                }}>
                                ₹{o.dish?.price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}>
                            <Avatar
                              src={o.customerId?.avatar}
                              name={o.customerId?.name}
                              size={28}
                              radius='50%'
                            />
                            <div>
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  color: "var(--on-surface)",
                                  fontFamily: "var(--font-display)",
                                }}>
                                {o.customerId?.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--outline)",
                                }}>
                                {o.customerId?.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            fontWeight: 600,
                            color: "var(--on-surface)",
                          }}>
                          {o.quantity}
                        </td>
                        <td
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            color: "var(--primary-container)",
                          }}>
                          ₹{o.totalAmount}
                        </td>
                        <td
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--on-surface-variant)",
                            maxWidth: "180px",
                          }}>
                          {o.deliveryAddress}
                        </td>
                        <td>
                          <span className={`badge ${statusClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${statusClass(o.paymentStatus)}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "var(--outline)",
                            fontSize: "0.8125rem",
                          }}>
                          {new Date(o.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
            COMMENTS RECEIVED (cook only)
        ══════════════════════════════════════════ */}
          {isCook && (
            <div
              className='table-card'
              style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
              <SectionHeader
                title='Comments Received'
                meta={`Last ${cookReceivedReviews.length}`}
              />

              {cookReceivedReviews.length === 0 ? (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "var(--outline)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                  }}>
                  No comments received yet
                </div>
              ) : (
                <div>
                  {cookReceivedReviews.map((r, i) => (
                    <div
                      key={r._id}
                      style={{
                        padding:
                          "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 28px)",
                        borderTop:
                          i === 0 ? "none" : "1px solid var(--outline-variant)",
                        display: "flex",
                        gap: "clamp(12px, 3vw, 16px)",
                        alignItems: "flex-start",
                      }}>
                      <Avatar
                        src={r.customerId?.avatar}
                        name={r.customerId?.name}
                        size={40}
                        radius='50%'
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "6px",
                            flexWrap: "wrap",
                          }}>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                              color: "var(--on-surface)",
                            }}>
                            {r.customerId?.name ?? "Customer"}
                          </span>
                          <span style={{ display: "flex", gap: "1px" }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                style={{
                                  fontSize: "0.9rem",
                                  color:
                                    s <= r.rating
                                      ? "#f59e0b"
                                      : "var(--outline-variant)",
                                }}>
                                ★
                              </span>
                            ))}
                          </span>
                          {r.orderId?.dish?.name && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--outline)",
                                fontFamily: "var(--font-body)",
                              }}>
                              on {r.orderId.dish.name}
                            </span>
                          )}
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: "0.75rem",
                              color: "var(--outline)",
                              whiteSpace: "nowrap",
                            }}>
                            {new Date(r.createdAt).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            color: "var(--on-surface-variant)",
                            lineHeight: 1.65,
                            fontFamily: "var(--font-body)",
                          }}>
                          {r.comment || "No written comment"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
            MENUS with DISHES (cook only)
        ══════════════════════════════════════════ */}
          {isCook && cookData?.menus?.length > 0 && (
            <div
              className='table-card'
              style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
              <SectionHeader
                title='Menus'
                meta={`${cookData.menus.length} total`}
              />

              <div>
                {cookData.menus.map((menu, mi) => (
                  <div
                    key={menu._id}
                    style={{
                      borderTop:
                        mi === 0 ? "none" : "1px solid var(--outline-variant)",
                      padding: "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 28px)",
                    }}>
                    {/* Menu meta row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(8px, 2vw, 10px)",
                        marginBottom: "16px",
                        flexWrap: "wrap",
                      }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "clamp(0.8rem, 2vw, 0.9375rem)",
                          color: "var(--on-surface)",
                        }}>
                        {menu.date}
                      </div>
                      <span className='badge badge-customer'>
                        {menu.mealType}
                      </span>
                      <span
                        className={`badge ${menu.isActive ? "badge-verified" : "badge-rejected"}`}>
                        {menu.isActive ? "Active" : "Inactive"}
                      </span>
                      <span
                        style={{
                          fontSize: "clamp(0.65rem, 1.8vw, 0.75rem)",
                          color: "var(--outline)",
                          marginLeft: "auto",
                          fontFamily: "var(--font-body)",
                        }}>
                        Cutoff: {menu.cutoffTime}
                      </span>
                    </div>

                    {/* Dish cards */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(190px, 1fr))",
                        gap: "clamp(10px, 2vw, 14px)",
                      }}>
                      {menu.dishes.map((dish) => (
                        <div
                          key={dish._id}
                          style={{
                            background: "var(--surface-container-low)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                          }}>
                          {dish.photo ? (
                            <img
                              src={dish.photo}
                              alt={dish.name}
                              style={{
                                width: "100%",
                                height: "110px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "110px",
                                background: "var(--primary-fixed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                              }}>
                              🍛
                            </div>
                          )}
                          <div
                            style={{
                              padding:
                                "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 14px)",
                            }}>
                            <div
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                                color: "var(--on-surface)",
                                marginBottom: "2px",
                              }}>
                              {dish.name}
                            </div>
                            {dish.description && (
                              <div
                                style={{
                                  fontSize: "clamp(0.6rem, 1.5vw, 0.6875rem)",
                                  color: "var(--outline)",
                                  marginBottom: "8px",
                                  lineHeight: 1.45,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}>
                                {dish.description}
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}>
                              <span
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 800,
                                  color: "var(--primary-container)",
                                  fontSize: "clamp(0.8rem, 2.2vw, 0.9375rem)",
                                }}>
                                ₹{dish.price}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.6875rem",
                                  color: "var(--outline)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                  fontWeight: 600,
                                }}>
                                {dish.portionsLeft}/{dish.maxPortions}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
            REVIEWS GIVEN
        ══════════════════════════════════════════ */}
          {reviews.length > 0 && (
            <div
              className='table-card'
              style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
              <SectionHeader
                title='Reviews Given'
                meta={`${reviews.length} total`}
              />

              <div>
                {reviews.map((r, i) => (
                  <div
                    key={r._id}
                    style={{
                      padding: "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 28px)",
                      borderTop:
                        i === 0 ? "none" : "1px solid var(--outline-variant)",
                      display: "flex",
                      gap: "clamp(12px, 3vw, 16px)",
                      alignItems: "flex-start",
                    }}>
                    <Avatar
                      src={r.cookId?.photo || r.cookId?.userId?.avatar}
                      name={r.cookId?.userId?.name}
                      size={Math.floor(40 * 1)}
                      radius='50%'
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "6px",
                          flexWrap: "wrap",
                        }}>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                            color: "var(--on-surface)",
                          }}>
                          {r.cookId?.userId?.name ?? "Cook"}
                        </span>
                        {/* Stars */}
                        <span style={{ display: "flex", gap: "1px" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: "0.9rem",
                                color:
                                  s <= r.rating
                                    ? "#f59e0b"
                                    : "var(--outline-variant)",
                              }}>
                              ★
                            </span>
                          ))}
                        </span>
                        {/* Dish thumbnail */}
                        {r.orderId?.dish?.photo && (
                          <img
                            src={r.orderId.dish.photo}
                            alt=''
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "var(--radius-sm)",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        {r.orderId?.dish?.name && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--outline)",
                              fontFamily: "var(--font-body)",
                            }}>
                            for {r.orderId.dish.name}
                          </span>
                        )}
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "0.75rem",
                            color: "var(--outline)",
                            whiteSpace: "nowrap",
                          }}>
                          {new Date(r.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      {r.comment && (
                        <div
                          style={{
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            color: "var(--on-surface-variant)",
                            lineHeight: 1.65,
                            fontFamily: "var(--font-body)",
                          }}>
                          {r.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
            RECENT NOTIFICATIONS
        ══════════════════════════════════════════ */}
          {notifications?.length > 0 && (
            <div
              className='table-card'
              style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
              <SectionHeader
                title='Recent Notifications'
                meta={`Last ${notifications.length}`}
              />

              <div>
                {notifications.map((n, i) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "clamp(10px, 2vw, 14px) clamp(16px, 4vw, 28px)",
                      borderTop:
                        i === 0 ? "none" : "1px solid var(--outline-variant)",
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(10px, 2vw, 14px)",
                      opacity: n.isRead ? 0.55 : 1,
                    }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: n.isRead
                          ? "var(--outline-variant)"
                          : "var(--primary)",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                        color: "var(--on-surface-variant)",
                        fontFamily: "var(--font-body)",
                      }}>
                      {n.message}
                    </div>
                    <span
                      className='badge badge-admin'
                      style={{ textTransform: "none", letterSpacing: 0 }}>
                      {n.type?.replace(/_/g, " ")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--outline)",
                        whiteSpace: "nowrap",
                      }}>
                      {new Date(n.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDetails;
