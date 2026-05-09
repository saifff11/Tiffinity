import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { ArrowLeft } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password");
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
          <span className='auth-back' onClick={() => navigate("/login")}>
            <ArrowLeft size={14} /> Back to login
          </span>

          <div className='auth-page-title text-2xl sm:text-3xl'>
            Forgot your password?
          </div>
          <p
            className='auth-page-sub text-sm sm:text-base'
            style={{
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              marginBottom: "clamp(20px, 5vw, 32px)",
            }}>
            No worries. Enter your email and we'll send you a reset OTP within
            minutes.
          </p>

          {error && <div className='error-box'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className='inp-group'>
              <label className='inp-label'>Email Address</label>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>mail</span>
                <input
                  className='inp-field'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  required
                />
              </div>
            </div>

            <button type='submit' className='auth-btn' disabled={loading}>
              {loading ? "Sending OTP…" : "Send Reset OTP"}
            </button>
          </form>

          <div className='auth-switch'>
            Remembered it?&nbsp;
            <span onClick={() => navigate("/login")}>Back to Login</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className='auth-right'>
        <img
          className='auth-right-photo'
          src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&auto=format&fit=crop'
          alt='Fresh food'
        />
        <div className='auth-right-content'>
          <div className='auth-right-brand'>TiffinBox</div>

          <div>
            <div className='auth-right-headline'>
              We got
              <br />
              your
              <br />
              <span className='accent'>back.</span>
            </div>
            <p className='auth-right-body'>
              Enter your email and we'll send you an OTP to reset your password
              instantly.
            </p>
          </div>

          <div className='auth-accent-bar'>
            <div className='auth-accent-bar-item long' />
            <div className='auth-accent-bar-item short' />
            <div className='auth-accent-bar-item short' />
          </div>

          <div className='auth-right-note'>
            Reset OTP is valid for 10 minutes only.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
