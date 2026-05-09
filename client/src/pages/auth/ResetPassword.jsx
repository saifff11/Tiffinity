import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import OTPInput from "../../components/OTPInput";
import { ArrowLeft } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6)
      return setError("Please enter the complete 6-digit OTP");
    if (formData.newPassword !== formData.confirmPassword)
      return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword: formData.newPassword,
      });
      setSuccess("Password reset successfully!");
      localStorage.removeItem("resetEmail");
      setTimeout(() => navigate("/login"), 1500);
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
          <span
            className='auth-back'
            onClick={() => navigate("/forgot-password")}>
            <ArrowLeft size={14} /> Back
          </span>

          <div className='auth-page-title text-2xl sm:text-3xl'>
            Reset your password.
          </div>
          <p
            className='auth-page-sub text-sm sm:text-base'
            style={{
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              marginBottom: "clamp(20px, 5vw, 32px)",
            }}>
            Enter the OTP sent to{" "}
            <strong style={{ color: "var(--on-surface)", fontWeight: 700 }}>
              {email}
            </strong>{" "}
            and set your new password.
          </p>

          {error && <div className='error-box'>{error}</div>}
          {success && <div className='success-box'>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "clamp(12px, 3vw, 18px)" }}>
              <label className='inp-label'>One-Time Password</label>
            </div>
            <OTPInput value={otp} onChange={setOtp} />

            <div className='inp-group'>
              <label className='inp-label'>New Password</label>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>lock</span>
                <input
                  className='inp-field'
                  type={showNew ? "text" : "password"}
                  name='newPassword'
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder='Min 6 characters'
                  required
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type='button'
                  className='inp-eye'
                  onClick={() => setShowNew(!showNew)}>
                  <span
                    className='material-symbols-outlined'
                    style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}>
                    {showNew ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className='inp-group'>
              <label className='inp-label'>Confirm Password</label>
              <div className='inp-icon-wrap'>
                <span className='material-symbols-outlined inp-icon'>
                  lock_reset
                </span>
                <input
                  className='inp-field'
                  type={showConfirm ? "text" : "password"}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Re-enter new password'
                  required
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type='button'
                  className='inp-eye'
                  onClick={() => setShowConfirm(!showConfirm)}>
                  <span
                    className='material-symbols-outlined'
                    style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}>
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='auth-btn'
              disabled={loading || otp.length < 6}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className='auth-right'>
        <img
          className='auth-right-photo'
          src='https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=900&auto=format&fit=crop'
          alt='Fresh food'
        />
        <div className='auth-right-content'>
          <div className='auth-right-brand'>TiffinBox</div>

          <div>
            <div className='auth-right-headline'>
              Almost
              <br />
              there.
              <br />
              <span className='accent'>New start.</span>
            </div>
            <p className='auth-right-body'>
              Set your new password and get back to ordering fresh homemade
              meals instantly.
            </p>
          </div>

          <div className='auth-accent-bar'>
            <div className='auth-accent-bar-item long' />
            <div className='auth-accent-bar-item short' />
            <div className='auth-accent-bar-item short' />
          </div>

          <div className='auth-right-note'>
            Make sure your new password is strong and secure.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
