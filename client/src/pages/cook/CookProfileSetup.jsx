import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Alert from "../../components/Alert";
import { validateCookProfile } from "../../utils/validate";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer";

const CUISINE_TAGS = [
  "Gujarati",
  "Punjabi",
  "South Indian",
  "Bengali",
  "Rajasthani",
  "Maharashtrian",
  "Vegan",
  "Jain",
];

const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024;

function CookProfileSetup() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    bio: "",
    cuisineType: "",
    city: user?.city || "",
    address: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoHovered, setPhotoHovered] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_PROFILE_PHOTO_SIZE) {
        setError("Photo must be 5MB or smaller. Please choose a smaller image.");
        e.target.value = "";
        return;
      }

      setError("");
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const updated = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      setFormData((fd) => ({ ...fd, cuisineType: updated.join(", ") }));
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateCookProfile(formData);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("bio", formData.bio);
      form.append("cuisineType", formData.cuisineType);
      form.append("city", formData.city);
      form.append("address", formData.address);
      if (photo) form.append("photo", photo);

      await axiosInstance.post("/cook/profile", form);
      setSuccess("Profile submitted successfully!");
      setTimeout(() => navigate("/cook/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────── */
  return (
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100vh",
        color: "var(--on-surface)",
      }}>
      {/* ── Navbar ── */}
      {/* <nav className='dashboard-navbar'>
        <div
          className='dashboard-navbar-brand'
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}>
          TiffinBox
        </div>
        <div className='dashboard-navbar-right'>
          <button
            onClick={() => handleLogout()}
            className='dashboard-navbar-user'
            style={{ background: "none", border: "none", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav> */}

      {/* ── MAIN ── */}
      <main
        className='px-3 sm:px-4 md:px-6'
        style={{
          paddingTop: "96px",
          paddingBottom: "64px",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "66px clamp(12px, 4vw, 24px) 64px",
        }}>
        <div
          className='mb-8 sm:mb-10 md:mb-12'
          style={{ marginBottom: "48px" }}>
          <h1
            className='text-2xl sm:text-3xl md:text-4xl'
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 900,
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}>
            Add Your Cook Profile
          </h1>
          <p className='auth-page-sub text-sm sm:text-base'>
            Start your new journey. Your kitchen, your story, your customers
          </p>
        </div>

        <Alert type='error' message={error} onClose={() => setError("")} />
        <Alert
          type='success'
          message={success}
          onClose={() => setSuccess("")}
        />

        {/* ── BENTO GRID ── */}
        <form noValidate onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "28px",
              alignItems: "start",
            }}>
            {/* ── LEFT COLUMN: media ── */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Profile portrait upload */}
              <div className='stat-card' style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "var(--on-surface)",
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                  <span
                    className='material-symbols-outlined'
                    style={{ fontSize: "20px", color: "var(--primary)" }}>
                    face
                  </span>
                  Profile Portrait
                </h3>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--on-surface-variant)",
                    lineHeight: 1.65,
                    marginBottom: "20px",
                  }}>
                  Let customers see the person behind the magic. A friendly
                  smile builds instant trust.
                </p>

                <label
                  htmlFor='photo'
                  style={{ cursor: "pointer", display: "block" }}
                  onMouseEnter={() => setPhotoHovered(true)}
                  onMouseLeave={() => setPhotoHovered(false)}>
                  {preview ? (
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        aspectRatio: "1",
                      }}>
                      <img
                        src={preview}
                        alt='Preview'
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      {photoHovered && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <div
                            style={{
                              background: "rgba(255,255,255,0.92)",
                              padding: "8px 18px",
                              borderRadius: "var(--radius-pill)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "var(--on-surface)",
                            }}>
                            <span
                              className='material-symbols-outlined'
                              style={{ fontSize: "14px" }}>
                              edit
                            </span>
                            Replace
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        border: `2px dashed ${photoHovered ? "var(--primary)" : "var(--border-light)"}`,
                        borderRadius: "var(--radius-lg)",
                        aspectRatio: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: photoHovered
                          ? "var(--primary-fixed)"
                          : "var(--surface-container-high)",
                        transition: "all 0.2s",
                        textAlign: "center",
                        padding: "32px",
                      }}>
                      <span
                        className='material-symbols-outlined'
                        style={{
                          fontSize: "40px",
                          color: "var(--outline)",
                          marginBottom: "10px",
                        }}>
                        add_a_photo
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "var(--on-surface)",
                          marginBottom: "4px",
                        }}>
                        Upload Photo
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--on-surface-variant)",
                        }}>
                        JPG or PNG (max. 5MB)
                      </p>
                    </div>
                  )}
                </label>
                <input
                  id='photo'
                  type='file'
                  accept='image/*'
                  onChange={handlePhoto}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN: form details ── */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Main form card */}
              <div className='table-card' style={{ padding: "32px" }}>
                {/* Bio */}
                <div style={{ marginBottom: "28px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}>
                    <label
                      className='inp-label'
                      style={{ margin: 0 }}
                      htmlFor='cook-bio'>
                      Your Culinary Story
                    </label>
                    <span
                      style={{
                        fontSize: "0.625rem",
                        color: "var(--on-surface-variant)",
                        fontFamily: "var(--font-body)",
                      }}>
                      {formData.bio.length} / 400
                    </span>
                  </div>
                  <textarea
                    id='cook-bio'
                    name='bio'
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={400}
                    rows={4}
                    placeholder='Tell us about your background, your passion for cooking, and what makes your kitchen special...'
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "var(--surface-container-high)",
                      border: "2px solid transparent",
                      borderRadius: "var(--radius-lg)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      color: "var(--on-surface)",
                      outline: "none",
                      resize: "vertical",
                      lineHeight: 1.65,
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--primary)";
                      e.target.style.background =
                        "var(--surface-container-lowest)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "transparent";
                      e.target.style.background =
                        "var(--surface-container-high)";
                    }}
                  />
                </div>

                {/* Cuisine specialty tags */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    className='inp-label'
                    style={{ display: "block", marginBottom: "12px" }}>
                    Cuisine Specialties
                  </label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {CUISINE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type='button'
                          onClick={() => toggleTag(tag)}
                          style={{
                            padding: "6px 16px",
                            borderRadius: "var(--radius-pill)",
                            border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border-light)"}`,
                            background: isSelected
                              ? "var(--primary-fixed)"
                              : "transparent",
                            color: isSelected
                              ? "var(--primary-container)"
                              : "var(--on-surface-variant)",
                            fontSize: "0.75rem",
                            fontWeight: isSelected ? 700 : 500,
                            fontFamily: "var(--font-body)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            letterSpacing: "0.02em",
                          }}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* City + address */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                    gap: "16px",
                    marginBottom: "28px",
                  }}>
                  <div className='inp-group' style={{ margin: 0 }}>
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
                        name='city'
                        type='text'
                        value={formData.city}
                        onChange={handleChange}
                        placeholder='Surat'
                        required
                      />
                    </div>
                  </div>
                  <div className='inp-group' style={{ margin: 0 }}>
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
                        name='address'
                        type='text'
                        value={formData.address}
                        onChange={handleChange}
                        placeholder='Your full address'
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Footer row: badge notice + submit */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    paddingTop: "24px",
                    borderTop: "1px solid var(--surface-container-high)",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--secondary)",
                    }}>
                    <span
                      className='material-symbols-outlined'
                      style={{ fontSize: "18px" }}>
                      verified
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        fontFamily: "var(--font-body)",
                        color: "var(--on-surface-variant)",
                      }}>
                      Verified Badge pending after Profile Approval
                    </span>
                  </div>

                  <button
                    type='submit'
                    disabled={loading}
                    className='auth-btn'
                    style={{
                      width: "auto",
                      margin: 0,
                      padding: "12px 28px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.9375rem",
                    }}>
                    {loading ? "Submitting…" : "Submit Profile for Approval"}
                    {!loading && (
                      <span
                        className='material-symbols-outlined'
                        style={{ fontSize: "18px" }}>
                        arrow_forward
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Tip card ── */}
              <div
                style={{
                  padding: "24px",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(0,212,254,0.08)",
                  border: "1px solid rgba(0,100,122,0.15)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}>
                <div
                  style={{
                    background: "var(--tertiary-fixed)",
                    padding: "12px",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--on-tertiary-fixed)",
                    flexShrink: 0,
                    display: "flex",
                  }}>
                  <span
                    className='material-symbols-outlined'
                    style={{ fontSize: "20px" }}>
                    tips_and_updates
                  </span>
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "0.9375rem",
                      color: "var(--on-surface)",
                      marginBottom: "6px",
                    }}>
                    Approval Process
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.65,
                      marginBottom: "12px",
                    }}>
                    After submission, your profile will be reviewed by our team.
                    You’ll be notified via email once it’s approved and ready to
                    go live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* ── SUBTLE FOOTER ── */}
      <Footer />
    </div>
  );
}

export default CookProfileSetup;
