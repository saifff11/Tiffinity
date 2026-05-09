import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import OTPInput from "../../components/OTPInput";
import { ArrowLeft } from "lucide-react";

function VerifyOTP() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("verifyEmail");

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6)
      return setError("Please enter the complete 6-digit OTP");
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
      });
      dispatch(setCredentials({ token: data.token, user: data.user }));
      localStorage.removeItem("verifyEmail");
      if (data.user.role === "cook") navigate("/cook/setup");
      else if (data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      setSuccess("New OTP sent to your email!");
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className='auth-wrap'>
      {/* ── LEFT ── */}
      <div className='auth-left'>
        <div className='auth-left-inner'>
          <span className='auth-back' onClick={() => navigate("/register")}>
            <ArrowLeft size={14} /> Back to register
          </span>

          <div className='auth-page-title text-2xl sm:text-3xl'>
            Check your email.
          </div>
          <p
            className='auth-page-sub text-sm sm:text-base'
            style={{
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              marginBottom: "clamp(20px, 5vw, 32px)",
            }}>
            We sent a 6-digit OTP to{" "}
            <strong style={{ color: "var(--on-surface)", fontWeight: 700 }}>
              {email}
            </strong>
          </p>

          {error && <div className='error-box'>{error}</div>}
          {success && <div className='success-box'>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "clamp(12px, 3vw, 18px)" }}>
              <label className='inp-label'>One-Time Password</label>
            </div>
            <OTPInput value={otp} onChange={setOtp} />

            <button
              type='submit'
              className='auth-btn'
              disabled={loading || otp.length < 6}>
              {loading ? "Verifying…" : "Verify Email"}
            </button>
          </form>

          <div
            className='auth-switch'
            style={{ marginTop: "clamp(14px, 3vw, 16px)" }}>
            Didn't receive OTP?&nbsp;
            <span onClick={handleResend}>
              {resending ? "Sending…" : "Resend OTP"}
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className='auth-right'>
        <img
          className='auth-right-photo'
          src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop'
          alt='Homemade food'
        />
        <div className='auth-right-content'>
          <div className='auth-right-brand'>TiffinBox</div>

          <div>
            <div className='auth-right-headline'>
              One step
              <br />
              away from
              <br />
              <span className='accent'>home food.</span>
            </div>
            <p className='auth-right-body'>
              Verify your email to start ordering fresh homemade meals from home
              cooks near you.
            </p>
          </div>

          <div className='auth-accent-bar'>
            <div className='auth-accent-bar-item long' />
            <div className='auth-accent-bar-item short' />
            <div className='auth-accent-bar-item short' />
          </div>

          <div className='auth-right-note'>
            OTP is valid for 10 minutes only.
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
