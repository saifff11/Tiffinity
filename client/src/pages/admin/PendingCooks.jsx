import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import Footer from "../../components/Footer";

function PendingCooks() {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);

  useEffect(() => {
    fetchPendingCooks();
  }, []);

  const fetchPendingCooks = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/cooks/pending");
      setCooks(data.pendingCooks);
    } catch (err) {
      void err;
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axiosInstance.put(`/admin/cooks/${confirmApproveId}/verify`);
      setCooks(cooks.filter((c) => c._id !== confirmApproveId));
      setConfirmApproveId(null);
    } catch (err) {
      void err;
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.put(`/admin/cooks/${confirmRejectId}/reject`, {
        reason: rejectReason,
      });
      setCooks(cooks.filter((c) => c._id !== confirmRejectId));
      setConfirmRejectId(null);
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      void err;
    }
  };

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

  return (
    <div>
      <div className='dashboard-wrap'>
        <Navbar showBack backPath='/admin/dashboard' backLabel='Dashboard' />

        <div
          className='dashboard-content px-3 sm:px-4 md:px-6'
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            paddingBottom: "48px",
          }}>
          {/* ── Page Header ── */}
          <div
            style={{
              marginBottom: "clamp(24px, 5vw, 36px)",
            }}>
            <div
              className='dashboard-title text-2xl sm:text-3xl'
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
                marginBottom: "clamp(6px, 1.5vw, 8px)",
              }}>
              Pending Cooks
            </div>
            <div
              className='dashboard-subtitle text-sm sm:text-base'
              style={{
                fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              }}>
              {cooks.length} cook{cooks.length !== 1 ? "s" : ""} waiting for
              approval
            </div>
          </div>

          {/* ── Empty State ── */}
          {cooks.length === 0 ? (
            <div className='table-card'>
              <div
                style={{
                  padding: "clamp(32px, 8vw, 56px) clamp(24px, 5vw, 48px)",
                  textAlign: "center",
                  color: "var(--outline)",
                  fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                  fontFamily: "var(--font-body)",
                }}>
                No pending cooks — all caught up!
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px, 3vw, 16px)",
              }}>
              {cooks.map((cook) => (
                <div
                  key={cook._id}
                  className='table-card'
                  style={{ overflow: "visible" }}>
                  {/* ── Cook Summary Row ── */}
                  <div
                    style={{
                      padding: "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 28px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "clamp(10px, 2.5vw, 16px)",
                      flexWrap: "wrap",
                    }}>
                    {/* Avatar + info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(10px, 2.5vw, 16px)",
                      }}>
                      {cook.photo ? (
                        <img
                          src={cook.photo}
                          alt='cook'
                          style={{
                            width: "clamp(40px, 10vw, 48px)",
                            height: "clamp(40px, 10vw, 48px)",
                            borderRadius: "var(--radius-lg)",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "clamp(40px, 10vw, 48px)",
                            height: "clamp(40px, 10vw, 48px)",
                            borderRadius: "var(--radius-lg)",
                            background: "var(--primary-fixed)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "clamp(16px, 4vw, 20px)",
                            flexShrink: 0,
                          }}>
                          👩‍🍳
                        </div>
                      )}
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--on-surface)",
                            fontSize: "clamp(0.8rem, 2.2vw, 0.9375rem)",
                            fontFamily: "var(--font-display)",
                            letterSpacing: "-0.01em",
                          }}>
                          {cook.userId?.name}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)",
                            color: "var(--outline)",
                            marginTop: "2px",
                            fontFamily: "var(--font-body)",
                          }}>
                          {cook.userId?.email} · {cook.city}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(6px, 1.5vw, 10px)",
                        flexWrap: "wrap",
                      }}>
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === cook._id ? null : cook._id,
                          )
                        }
                        style={{
                          background: "var(--surface-container-high)",
                          border: "none",
                          borderRadius: "var(--radius-lg)",
                          padding:
                            "clamp(6px, 1.5vw, 7px) clamp(12px, 2.5vw, 16px)",
                          fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)",
                          fontWeight: 600,
                          cursor: "pointer",
                          color: "var(--on-surface-variant)",
                          fontFamily: "var(--font-body)",
                          transition: "background 0.2s",
                        }}>
                        {expandedId === cook._id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                      <button
                        className='btn-approve'
                        onClick={() => setConfirmApproveId(cook._id)}>
                        Approve
                      </button>
                      <button
                        className='btn-reject'
                        style={{ marginLeft: 0 }}
                        onClick={() => setRejectingId(cook._id)}>
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* ── Expanded Details ── */}
                  {expandedId === cook._id && (
                    <div
                      style={{
                        borderTop: "1px solid var(--outline-variant)",
                        padding: "clamp(16px, 4vw, 28px)",
                        background: "var(--surface-container-low)",
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                        gap: "clamp(14px, 3vw, 20px)",
                      }}>
                      {cook.photo && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <img
                            src={cook.photo}
                            alt='cook'
                            style={{
                              width: "clamp(80px, 20vw, 100px)",
                              height: "clamp(80px, 20vw, 100px)",
                              borderRadius: "var(--radius-lg)",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}

                      {[
                        { label: "Full Name", value: cook.userId?.name },
                        { label: "Email", value: cook.userId?.email },
                        { label: "City", value: cook.city },
                        { label: "Address", value: cook.address },
                        {
                          label: "Cuisine Type",
                          value: cook.cuisineType?.join(", "),
                        },
                        {
                          label: "Submitted On",
                          value: `${new Date(cook.createdAt).toLocaleDateString("en-GB")} at ${new Date(cook.createdAt).toLocaleTimeString()}`,
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
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
                              fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                              color: "var(--on-surface)",
                              fontWeight: 500,
                              fontFamily: "var(--font-body)",
                            }}>
                            {value}
                          </div>
                        </div>
                      ))}

                      <div style={{ gridColumn: "1 / -1" }}>
                        <div
                          className='stat-card-label'
                          style={{
                            marginBottom: "4px",
                            fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
                          }}>
                          Bio
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                            color: "var(--on-surface)",
                            fontWeight: 500,
                            lineHeight: 1.65,
                            fontFamily: "var(--font-body)",
                          }}>
                          {cook.bio}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Reject Reason Input ── */}
                  {rejectingId === cook._id && (
                    <div
                      style={{
                        borderTop: "1px solid var(--error-border)",
                        padding:
                          "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 28px)",
                        background: "var(--error-bg)",
                        borderBottomLeftRadius: "var(--radius-lg)",
                        borderBottomRightRadius: "var(--radius-lg)",
                      }}>
                      <div
                        style={{
                          fontSize: "clamp(0.72rem, 1.8vw, 0.8125rem)",
                          fontWeight: 700,
                          color: "var(--error)",
                          marginBottom: "clamp(8px, 2vw, 12px)",
                          fontFamily: "var(--font-display)",
                        }}>
                        Enter rejection reason:
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "clamp(6px, 1.5vw, 10px)",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}>
                        <div className='inp-icon-wrap' style={{ flex: 1 }}>
                          <input
                            className='inp-field no-icon'
                            placeholder='e.g. Profile information incomplete…'
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            style={{
                              borderColor: "var(--error-border)",
                              fontSize: "clamp(0.875rem, 2.2vw, 0.9375rem)",
                            }}
                          />
                        </div>
                        <button
                          className='btn-reject'
                          style={{
                            marginLeft: 0,
                            padding:
                              "clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)",
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8125rem)",
                          }}
                          onClick={() => setConfirmRejectId(cook._id)}>
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason("");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--outline)",
                            cursor: "pointer",
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8125rem)",
                            fontFamily: "var(--font-body)",
                            transition: "color 0.15s",
                          }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* ── Confirm Approve Dialog ── */}
      {confirmApproveId && (
        <ConfirmDialog
          message={`Are you sure you want to approve ${cooks.find((c) => c._id === confirmApproveId)?.userId?.name}?`}
          confirmLabel='Approve'
          confirmColor='#16A34A'
          onConfirm={handleApprove}
          onCancel={() => setConfirmApproveId(null)}
        />
      )}

      {/* ── Confirm Reject Dialog ── */}
      {confirmRejectId && (
        <ConfirmDialog
          message={`Are you sure you want to reject ${cooks.find((c) => c._id === confirmRejectId)?.userId?.name}?`}
          confirmLabel='Reject'
          confirmColor='#DC2626'
          onConfirm={handleReject}
          onCancel={() => {
            setConfirmRejectId(null);
          }}
        />
      )}
    </div>
  );
}

export default PendingCooks;
