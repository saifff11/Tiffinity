import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import { validateLogin } from "../../utils/validate";
import { ArrowLeft } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateLogin(formData);
    if (validationError) return setError(validationError);
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      dispatch(setCredentials({ token: data.token, user: data.user }));
      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "cook") navigate("/cook/dashboard");
      else navigate("/home");
    } catch (err) {
      if (err.response?.data?.isVerified === false) {
        localStorage.setItem("verifyEmail", err.response.data.email);
        navigate("/verify-otp");
        return;
      }
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
            Welcome back
          </div>
          <p
            className='auth-page-sub text-sm sm:text-base'
            style={{
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              marginBottom: "clamp(20px, 5vw, 32px)",
            }}>
            Enter your credentials to access your kitchen.
          </p>

          {error && <div className='error-box'>{error}</div>}

          <form noValidate onSubmit={handleSubmit}>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "clamp(6px, 1.5vw, 8px)",
                  gap: "clamp(8px, 2vw, 10px)",
                  flexWrap: "wrap",
                }}>
                <label className='inp-label' style={{ margin: 0 }}>
                  Password
                </label>
                <Link
                  to='/forgot-password'
                  className='auth-forgot'
                  style={{
                    fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
                    fontWeight: 700,
                  }}>
                  Forgot Password?
                </Link>
              </div>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>lock</span>
                <input
                  className='inp-field'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              className='auth-btn'
              disabled={loading}
              style={{
                marginTop: "clamp(8px, 2vw, 10px)",
                padding: "clamp(10px, 2.5vw, 14px)",
                fontSize: "clamp(0.875rem, 2.2vw, 0.9375rem)",
              }}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <div className='auth-switch'>
            New here?&nbsp;<Link to='/register'>Create an account</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className='auth-right'>
        <img
          className='auth-right-photo'
          src='https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop'
          alt='Fresh tiffin meals'
        />
        <div className='auth-right-content'>
          <div className='auth-right-brand'>TiffinBox</div>

          <div style={{ marginBottom: "35px" }}>
            <div className='auth-right-headline'>
              Not what
              <br />
              they send —
              <br />
              <span className='accent'>what you want.</span>
            </div>
            <p className='auth-right-body'>
              Subscribe to a verified home cook and Tiffin service provider near
              you and pick your meal every morning — fresh, homemade, exactly
              what you want. No more eating what someone else decided.
            </p>
          </div>

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

export default Login;
