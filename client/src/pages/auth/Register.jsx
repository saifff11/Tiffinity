import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { validateRegister } from "../../utils/validate";
import { ArrowLeft } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    city: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateRegister(formData);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/register", formData);
      localStorage.setItem("verifyEmail", data.email);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-wrap'>
      {/* ── LEFT ── */}
      <div className='auth-left'>
        <div className='auth-left-inner'>
          <span className='auth-back' onClick={() => navigate("/")}>
            <ArrowLeft size={14} /> Back to Home page
          </span>

          <div className='auth-brand'>
            TiffinBox
            <span className='auth-brand-dot' />
          </div>

          <div className='auth-page-title text-2xl sm:text-3xl'>
            Create your account
          </div>
          <p
            className='auth-page-sub text-sm sm:text-base'
            style={{
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              marginBottom: "clamp(20px, 5vw, 32px)",
            }}>
            Join thousands of food lovers today.
          </p>

          {/* Role Toggle */}
          <div className='role-toggle'>
            <button
              type='button'
              className={`role-toggle-btn${formData.role === "customer" ? " active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "customer" })}>
              <span
                className='material-symbols-outlined'
                style={{ fontSize: "15px" }}>
                shopping_bag
              </span>
              Order Food
            </button>
            <button
              type='button'
              className={`role-toggle-btn${formData.role === "cook" ? " active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "cook" })}>
              <span
                className='material-symbols-outlined'
                style={{ fontSize: "15px" }}>
                restaurant
              </span>
              Sell Food
            </button>
          </div>

          {error && <div className='error-box'>{error}</div>}

          <form noValidate onSubmit={handleSubmit}>
            <div className='inp-row'>
              <div className='inp-group'>
                <label className='inp-label'>Full Name</label>
                <div className='inp-icon-wrap'>
                  <span className='material-symbols-outlined inp-icon'>
                    person
                  </span>
                  <input
                    className='inp-field'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='John Doe'
                    required
                  />
                </div>
              </div>
              <div className='inp-group'>
                <label className='inp-label'>City</label>
                <div className='inp-icon-wrap'>
                  <span className='material-symbols-outlined inp-icon'>
                    location_on
                  </span>
                  <input
                    className='inp-field'
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    placeholder='Surat'
                    required
                  />
                </div>
              </div>
            </div>

            <div className='inp-group'>
              <label className='inp-label'>Email Address</label>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>mail</span>
                <input
                  className='inp-field'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='you@example.com'
                  required
                />
              </div>
            </div>

            <div className='inp-group'>
              <label className='inp-label'>Password</label>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>lock</span>
                <input
                  className='inp-field'
                  type={showPassword ? "text" : "password"}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Min 6 characters'
                  required
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type='button'
                  className='inp-eye'
                  onClick={() => setShowPassword(!showPassword)}>
                  <span
                    className='material-symbols-outlined'
                    style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className='inp-group'>
              <label className='inp-label'>
                Mobile Number{" "}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    fontSize: "10px",
                    letterSpacing: 0,
                  }}>
                  (optional)
                </span>
              </label>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>
                  phone
                </span>
                <input
                  className='inp-field'
                  type='text'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='0123456789'
                />
              </div>
            </div>

            <button type='submit' className='auth-btn' disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div
            className='auth-terms'
            style={{
              fontSize: "clamp(0.72rem, 1.8vw, 0.8125rem)",
              color: "var(--on-surface-variant)",
            }}>
            By creating an account you confirm you have read and accepted
            TiffinBox's
            <Link
              to='/terms-and-conditions'
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline", // Ensures it doesn't behave like a block
                margin: "0 4px",
              }}>
              Terms of Service
            </Link>
            and
            <Link
              to='/policy'
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline",
                marginLeft: "4px",
              }}>
              Privacy Policy
            </Link>
            .
          </div>

          <div className='auth-switch'>
            Already have an account?&nbsp;<Link to='/login'>Login here</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className='auth-right'>
        <img
          className='auth-right-photo'
          src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop'
          alt='Homemade food spread'
        />
        <div className='auth-right-content' style={{ marginBottom: "35px" }}>
          <div className='auth-right-brand'>TiffinBox</div>

            <div >
              <div className='auth-right-headline'>
                Miss mom's
                <br />
                cooking?
                <br />
                <span className='accent'>We got you.</span>
              </div>
              <p className='auth-right-body'>
                Pre-order fresh homemade meals from verified tiffin service provider & home cooks in your
                city. Skip the hassle, eat like home.
              </p>
            </div>

            <div className='auth-features'>
              {[
                "Order 2–3 hours before mealtime",
                "Fresh food, zero wastage",
                "No fixed menu — you choose, every day",
              ].map((f, i) => (
                <div key={i} className='auth-feature-item'>
                  <div className='auth-feature-dot' />
                  {f}
                </div>
              ))}
            </div>

          {/* <div className='auth-accent-bar'>
            <div className='auth-accent-bar-item long' />
            <div className='auth-accent-bar-item short' />
            <div className='auth-accent-bar-item short' />
          </div> */}

          {/* <div className='auth-stats'>
            {[
              ["2K+", "Home Cooks"],
              ["50K+", "Meals Served"],
              ["4.8★", "Avg Rating"],
            ].map(([num, label], i) => (
              <div key={i}>
                <div className='auth-stat-num'>{num}</div>
                <div className='auth-stat-label'>{label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Register;
