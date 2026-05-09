import { useRef } from "react";

function OTPInput({ value, onChange }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const otpArr = value.split("");
    otpArr[index] = val;
    onChange(otpArr.join(""));

    if (index < 5) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const otpArr = value.split("");
      otpArr[index] = "";
      onChange(otpArr.join(""));
      if (index > 0) inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    onChange(paste.padEnd(6, "").slice(0, 6));
    const focusIndex = Math.min(paste.length, 5);
    inputs.current[focusIndex].focus();
  };

  return (
    <div>
      <div
        className='inp-label'
        style={{ marginBottom: "clamp(8px, 2vw, 10px)" }}>
        Enter OTP
      </div>
      <div className='otp-boxes'>
        {Array(6)
          .fill("")
          .map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              className={`otp-box ${value[i] ? "filled" : ""}`}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={value[i] || ""}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
            />
          ))}
      </div>
    </div>
  );
}

export default OTPInput;
