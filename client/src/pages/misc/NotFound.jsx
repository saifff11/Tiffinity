import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Utensils, Smile } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGoHome = () => {
    if (!user) navigate("/home");
    else if (user.role === "cook") navigate("/cook/dashboard");
    else if (user.role === "admin") navigate("/admin/dashboard");
    else navigate("/home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f6f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body)",
        padding: "16px",
      }}>
      <div style={{ textAlign: "center", padding: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
            color: "var(--ink)",
          }}>
          <Utensils size={80} />
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "var(--brand)",
            letterSpacing: "-4px",
            lineHeight: 1,
            marginBottom: "12px",
          }}>
          404
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-0.5px",
            marginBottom: "8px",
          }}>
          Page not found
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "var(--muted)",
            marginBottom: "28px",
            lineHeight: 1.6,
          }}>
          Looks like this page went out for delivery
          <br />
          and never came back{" "}
          <Smile
            size={16}
            style={{ display: "inline", verticalAlign: "middle" }}
          />
        </div>
        <button
          className='auth-btn'
          style={{ width: "auto", padding: "12px 28px" }}
          onClick={handleGoHome}>
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
