import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import { validateMenu } from "../../utils/validate";
import NotificationBell from "../../components/NotificationBell";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Pencil,
  Trash2,
  X,
  PlusCircle,
  LogOut,
  ChefHat,
  ListOrdered,
  Menu,
} from "lucide-react";
import DishForm from "../../components/DishForm";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import {
  getCurrentTimeInIST,
  getNowMinutesInIST,
  isMenuExpiredInIST,
} from "../../utils/timeZone";

function PostMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mealType, setMealType] = useState("lunch");
  const [cutoffTime, setCutoffTime] = useState("10:00");
  const [dishes, setDishes] = useState([
    { name: "", photo: "", description: "", price: "", maxPortions: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPhotoPicker, setShowPhotoPicker] = useState(null);
  const [existingMenus, setExistingMenus] = useState([]);
  const [confirmDeleteMenuId, setConfirmDeleteMenuId] = useState(null);
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineFormData, setInlineFormData] = useState({});
  const [inlinePhotoPicker, setInlinePhotoPicker] = useState(null);
  const [inlineLoading, setInlineLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentMinutesInIST, setCurrentMinutesInIST] = useState(0);

  const isMenuExpired = (menu) => {
    return isMenuExpiredInIST(menu, currentMinutesInIST);
  };

  const getCurrentTime = () => {
    return getCurrentTimeInIST();
  };

  useEffect(() => {
    fetchMyMenus();
  }, []);

  useEffect(() => {
    const syncCurrentMinutes = () => {
      setCurrentMinutesInIST(getNowMinutesInIST());
    };

    syncCurrentMinutes();
    const intervalId = setInterval(syncCurrentMinutes, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMobileNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchMyMenus = async () => {
    try {
      const { data } = await axiosInstance.get("/menu/my");
      setExistingMenus(data.menus);
    } catch (err) {
      void err;
    }
  };

  const handleDishChange = (index, field, value) => {
    const updated = [...dishes];
    updated[index][field] = value;
    setDishes(updated);
  };

  const handleAddDish = () => {
    setDishes([
      ...dishes,
      { name: "", photo: "", description: "", price: "", maxPortions: "" },
    ]);
  };

  const handleRemoveDish = (index) => {
    if (dishes.length === 1) return;
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handleSelectPhoto = (index, url) => {
    handleDishChange(index, "photo", url);
    setShowPhotoPicker(null);
  };

  const handleInlineEdit = (menu) => {
    setInlineEditId(menu._id);
    setInlineFormData({
      cutoffTime: menu.cutoffTime,
      dishes: menu.dishes.map((d) => ({
        name: d.name,
        photo: d.photo,
        description: d.description,
        price: d.price,
        maxPortions: d.maxPortions,
      })),
    });
  };

  const handleInlineDishChange = (index, field, value) => {
    const updated = [...inlineFormData.dishes];
    updated[index][field] = value;
    setInlineFormData({ ...inlineFormData, dishes: updated });
  };

  const handleInlineAddDish = () => {
    setInlineFormData({
      ...inlineFormData,
      dishes: [
        ...inlineFormData.dishes,
        { name: "", photo: "", description: "", price: "", maxPortions: "" },
      ],
    });
  };

  const handleInlineRemoveDish = (index) => {
    if (inlineFormData.dishes.length === 1) return;
    setInlineFormData({
      ...inlineFormData,
      dishes: inlineFormData.dishes.filter((_, i) => i !== index),
    });
  };

  const handleInlineSelectPhoto = (index, url) => {
    handleInlineDishChange(index, "photo", url);
    setInlinePhotoPicker(null);
  };

  const handleInlineSubmit = async (menuId) => {
    const validationError = validateMenu(
      inlineFormData.dishes,
      inlineFormData.cutoffTime,
    );
    if (validationError) return setError(validationError);
    setInlineLoading(true);
    try {
      const payload = {
        cutoffTime: inlineFormData.cutoffTime,
        dishes: inlineFormData.dishes.map((d) => ({
          ...d,
          price: Number(d.price),
          maxPortions: Number(d.maxPortions),
        })),
      };
      await axiosInstance.put(`/menu/${menuId}`, payload);
      navigate("/cook/dashboard");

      setSuccess("Menu updated successfully!");
      setInlineEditId(null);
      fetchMyMenus();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setInlineLoading(false);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      await axiosInstance.delete(`/menu/${confirmDeleteMenuId}`);
      setExistingMenus(
        existingMenus.filter((m) => m._id !== confirmDeleteMenuId),
      );
      setSuccess("Menu deleted successfully!");
      setConfirmDeleteMenuId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateMenu(dishes, cutoffTime);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        mealType,
        cutoffTime,
        dishes: dishes.map((d) => ({
          ...d,
          price: Number(d.price),
          maxPortions: Number(d.maxPortions),
        })),
      };
      await axiosInstance.post("/menu", payload);
      navigate("/cook/dashboard");

      setSuccess(`${mealType} menu posted successfully!`);
      fetchMyMenus();
      setDishes([
        { name: "", photo: "", description: "", price: "", maxPortions: "" },
      ]);
      setCutoffTime(mealType === "lunch" ? "10:00" : "16:00");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  /* ─── render ───────────────────────────────────────── */
  return (
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
            Post Today's Menu
          </h1>
          <p
            className='text-sm sm:text-base'
            style={{ fontSize: "1rem", color: "var(--on-surface-variant)" }}>
            Add dishes for lunch or dinner today
          </p>
        </div>

        <Alert type='error' message={error} onClose={() => setError("")} />
        <Alert
          type='success'
          message={success}
          onClose={() => setSuccess("")}
        />

        {/* ── EXISTING MENUS ── */}
        {existingMenus.length > 0 && (
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
            {/* Card header */}
            <div
              className='flex flex-col sm:flex-row gap-2 sm:gap-3'
              style={{
                padding: "clamp(14px, 3vw, 18px) clamp(14px, 4vw, 24px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                background:
                  "linear-gradient(180deg, rgba(6,78,59,0.06) 0%, rgba(6,78,59,0.02) 100%)",
                borderBottom: "1px solid var(--surface-container-high)",
              }}>
              <h2
                className='text-base sm:text-lg'
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(0.95rem, 2.8vw, 1.05rem)",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}>
                Today's Posted Menus
              </h2>
              <span
                style={{
                  fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                  fontWeight: 600,
                  color: "var(--on-surface-variant)",
                  background: "var(--surface-container-high)",
                  padding: "clamp(3px, 1vw, 4px) clamp(8px, 2.4vw, 10px)",
                  borderRadius: "var(--radius-pill)",
                }}>
                {existingMenus.length} menu
                {existingMenus.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div
              style={{
                padding: "clamp(12px, 3vw, 16px) clamp(12px, 3.5vw, 20px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(10px, 2.2vw, 12px)",
              }}>
              {existingMenus.map((menu) => {
                const expired = isMenuExpired(menu);

                return (
                  <div
                    key={menu._id}
                    style={{
                      borderRadius: "var(--radius-lg)",
                      border: `1px solid ${expired ? "rgba(20,27,43,0.08)" : "rgba(6,78,59,0.2)"}`,
                      overflow: "hidden",
                      background: expired
                        ? "var(--surface-container-low)"
                        : "rgba(6,78,59,0.08)",
                    }}>
                    {/* Menu summary row */}
                    <div
                      className='flex flex-col sm:flex-row gap-3 sm:gap-3'
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        padding:
                          "clamp(12px, 3vw, 14px) clamp(12px, 3.2vw, 18px)",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title + badges */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                            marginBottom: "4px",
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

                          {/* Status badge */}
                          <span
                            style={{
                              fontSize: "clamp(0.62rem, 1.9vw, 0.6875rem)",
                              fontWeight: 700,
                              padding:
                                "clamp(3px, 1vw, 4px) clamp(8px, 2.3vw, 10px)",
                              borderRadius: "var(--radius-pill)",
                              background: expired
                                ? "#fee2e2"
                                : "var(--primary-fixed)",
                              color: expired
                                ? "#991b1b"
                                : "var(--primary-container)",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}>
                            {expired ? "Expired" : "Live"}
                          </span>

                          {inlineEditId === menu._id && (
                            <span
                              style={{
                                fontSize: "clamp(0.62rem, 1.9vw, 0.6875rem)",
                                fontWeight: 700,
                                padding:
                                  "clamp(3px, 1vw, 4px) clamp(8px, 2.3vw, 10px)",
                                borderRadius: "var(--radius-pill)",
                                background: "var(--primary-fixed-dim)",
                                color: "var(--primary-container)",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}>
                              Editing
                            </span>
                          )}
                        </div>

                        {/* Meta */}
                        <p
                          style={{
                            fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                            color: "var(--on-surface-variant)",
                            marginBottom: "8px",
                          }}>
                          {menu.dishes?.length} dishes · cutoff{" "}
                          {menu.cutoffTime}
                        </p>

                        {/* Dish tags */}
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}>
                          {menu.dishes?.map((d, i) => (
                            <span
                              key={i}
                              style={{
                                padding:
                                  "clamp(3px, 1vw, 4px) clamp(8px, 2.2vw, 10px)",
                                borderRadius: "var(--radius-pill)",
                                background: "rgba(6,78,59,0.08)",
                                color: "var(--primary-container)",
                                fontSize: "clamp(0.68rem, 2vw, 0.75rem)",
                                fontWeight: 600,
                                fontFamily: "var(--font-body)",
                              }}>
                              {d.name} · ₹{d.price}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {!expired && (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexShrink: 0,
                            flexWrap: "wrap",
                          }}>
                          <button
                            onClick={() =>
                              inlineEditId === menu._id
                                ? setInlineEditId(null)
                                : handleInlineEdit(menu)
                            }
                            className='text-xs sm:text-sm'
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              padding:
                                "clamp(6px, 1.5vw, 7px) clamp(11px, 2.8vw, 14px)",
                              borderRadius: "var(--radius-lg)",
                              border: `1.5px solid ${inlineEditId === menu._id ? "transparent" : "var(--primary)"}`,
                              background:
                                inlineEditId === menu._id
                                  ? "var(--primary)"
                                  : "transparent",
                              color:
                                inlineEditId === menu._id
                                  ? "#fff"
                                  : "var(--primary)",
                              fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "var(--font-display)",
                              transition: "all 0.2s",
                            }}>
                            {inlineEditId === menu._id ? (
                              <>
                                <X size={13} /> Cancel
                              </>
                            ) : (
                              <>
                                <Pencil size={13} /> Edit
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteMenuId(menu._id)}
                            className='text-xs sm:text-sm'
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              padding:
                                "clamp(6px, 1.5vw, 7px) clamp(11px, 2.8vw, 14px)",
                              borderRadius: "var(--radius-lg)",
                              border: "1.5px solid rgba(220,38,38,0.25)",
                              background: "#fee2e2",
                              color: "#991b1b",
                              fontSize: "clamp(0.72rem, 2.1vw, 0.8125rem)",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "var(--font-display)",
                            }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── INLINE EDIT FORM ── */}
                    {inlineEditId === menu._id && (
                      <div
                        style={{
                          padding: "20px",
                          borderTop: "1px solid var(--surface-container-high)",
                          background: "var(--surface-container-lowest)",
                        }}>
                        {/* Cutoff time */}
                        <div className='inp-group'>
                          <label className='inp-label'>
                            Cutoff Time (24hr)
                          </label>
                          <div className='inp-icon-wrap'>
                            <span className='material-symbols-outlined inp-icon'>
                              schedule
                            </span>
                            <input
                              className='inp-field'
                              type='time'
                              value={inlineFormData.cutoffTime}
                              onChange={(e) =>
                                setInlineFormData({
                                  ...inlineFormData,
                                  cutoffTime: e.target.value,
                                })
                              }
                              min={getCurrentTime()}
                              max={
                                menu.mealType === "lunch" ? "13:00" : "20:00"
                              }
                              required
                            />
                          </div>
                        </div>

                        {/* Dishes */}
                        {inlineFormData.dishes?.map((dish, index) => (
                          <DishForm
                            key={index}
                            dish={dish}
                            index={index}
                            onFieldChange={handleInlineDishChange}
                            onRemove={handleInlineRemoveDish}
                            canRemove={inlineFormData.dishes.length > 1}
                            photoPicker={inlinePhotoPicker}
                            setPhotoPicker={setInlinePhotoPicker}
                            onSelectPhoto={handleInlineSelectPhoto}
                          />
                        ))}

                        {/* Add dish */}
                        <button
                          type='button'
                          onClick={handleInlineAddDish}
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "var(--primary-fixed)",
                            color: "var(--primary-container)",
                            border: "2px dashed rgba(5,150,105,0.35)",
                            borderRadius: "var(--radius-lg)",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            marginBottom: "16px",
                            transition: "background 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--primary-fixed-dim)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "var(--primary-fixed)")
                          }>
                          <span
                            className='material-symbols-outlined'
                            style={{ fontSize: "16px" }}>
                            add
                          </span>
                          Add Another Dish
                        </button>

                        {/* Save / Cancel */}
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => handleInlineSubmit(menu._id)}
                            disabled={inlineLoading}
                            className='auth-btn'
                            style={{ flex: 1, margin: 0 }}>
                            {inlineLoading ? "Saving…" : "Save Changes"}
                          </button>
                          <button
                            onClick={() => setInlineEditId(null)}
                            style={{
                              padding: "12px 20px",
                              borderRadius: "var(--radius-lg)",
                              border: "1px solid var(--surface-container-high)",
                              background: "var(--surface-container-low)",
                              color: "var(--on-surface-variant)",
                              fontSize: "0.9375rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "var(--font-display)",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "var(--surface-container-high)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background =
                                "var(--surface-container-low)")
                            }>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── POST NEW MENU FORM ── */}
        <form noValidate onSubmit={handleSubmit}>
          {/* Menu details card */}
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
              marginBottom: "20px",
              overflow: "hidden",
            }}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--surface-container-high)",
              }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}>
                Menu Details
              </h2>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}>
                {/* Meal type toggle */}
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <label
                    className='inp-label'
                    style={{ display: "block", marginBottom: "10px" }}>
                    Meal Type
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      background: "var(--surface-container-high)",
                      padding: "4px",
                      borderRadius: "var(--radius-lg)",
                    }}>
                    {["lunch", "dinner"].map((type) => (
                      <button
                        key={type}
                        type='button'
                        onClick={() => {
                          setMealType(type);
                          setCutoffTime(type === "lunch" ? "10:00" : "16:00");
                        }}
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          borderRadius: "calc(var(--radius-lg) - 2px)",
                          border: "none",
                          background:
                            mealType === type
                              ? "var(--surface-container-lowest)"
                              : "transparent",
                          color:
                            mealType === type
                              ? "var(--primary-container)"
                              : "var(--on-surface-variant)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          textTransform: "capitalize",
                          boxShadow:
                            mealType === type
                              ? "0 1px 6px rgba(6,78,59,0.12)"
                              : "none",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}>
                        <span
                          className='material-symbols-outlined'
                          style={{ fontSize: "16px" }}>
                          {type === "lunch" ? "wb_sunny" : "nights_stay"}
                        </span>
                        {type === "lunch" ? "Lunch" : "Dinner"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cutoff time */}
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <div className='inp-group' style={{ margin: 0 }}>
                    <label className='inp-label'>Cutoff Time (24hr)</label>
                    <div className='inp-icon-wrap'>
                      <span className='material-symbols-outlined inp-icon'>
                        schedule
                      </span>
                      <input
                        className='inp-field'
                        type='time'
                        value={cutoffTime}
                        onChange={(e) => setCutoffTime(e.target.value)}
                        min={getCurrentTime()}
                        max={mealType === "lunch" ? "13:00" : "20:00"}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dishes card */}
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 2px 16px rgba(20,27,43,0.04)",
              marginBottom: "20px",
              overflow: "hidden",
            }}>
            <div
              style={{
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--surface-container-high)",
              }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "var(--on-surface)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}>
                Dishes
              </h2>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--on-surface-variant)",
                  background: "var(--surface-container-high)",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-pill)",
                }}>
                {dishes.length} dish{dishes.length !== 1 ? "es" : ""}
              </span>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {dishes.map((dish, index) => (
                <DishForm
                  key={index}
                  dish={dish}
                  index={index}
                  onFieldChange={handleDishChange}
                  onRemove={handleRemoveDish}
                  canRemove={dishes.length > 1}
                  photoPicker={showPhotoPicker}
                  setPhotoPicker={setShowPhotoPicker}
                  onSelectPhoto={handleSelectPhoto}
                />
              ))}

              {/* Add dish button */}
              <button
                type='button'
                onClick={handleAddDish}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "var(--primary-fixed)",
                  color: "var(--primary-container)",
                  border: "2px dashed rgba(5,150,105,0.35)",
                  borderRadius: "var(--radius-lg)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--primary-fixed-dim)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--primary-fixed)")
                }>
                <span
                  className='material-symbols-outlined'
                  style={{ fontSize: "18px" }}>
                  add_circle
                </span>
                Add Another Dish
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type='submit'
            className='auth-btn'
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}>
            <span
              className='material-symbols-outlined'
              style={{ fontSize: "18px" }}>
              {mealType === "lunch" ? "wb_sunny" : "nights_stay"}
            </span>
            {loading
              ? "Saving…"
              : `Post ${mealType === "lunch" ? "Lunch" : "Dinner"} Menu`}
          </button>
        </form>
      </div>

      {/* Confirm delete dialog */}
      {confirmDeleteMenuId && (
        <ConfirmDialog
          message='Are you sure you want to delete this menu?'
          confirmLabel='Delete'
          confirmColor='#DC2626'
          onConfirm={handleDeleteMenu}
          onCancel={() => setConfirmDeleteMenuId(null)}
        />
      )}

      {/* Mobile responsive tweaks */}
      <style>{`
        @media (max-width: 600px) {
          .inp-row { flex-direction: column; gap: 0; }
        }
      `}</style>
      <Footer />
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

export default PostMenu;
