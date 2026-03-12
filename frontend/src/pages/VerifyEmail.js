import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "../styles/Verify.css";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [email_input, setEmailInput] = useState(email || "");
  const [status, setStatus] = useState("form"); // form | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Handle code input - only allow numbers and max 6 digits
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  // Verify email with code
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email_input || !code) {
      toast.error("Please enter email and verification code");
      return;
    }

    if (code.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      await API.post("/auth/verify", {
        email: email_input,
        code: code,
      });

      setStatus("success");
      toast.success("Email verified successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus("error");
      const message =
        error.response?.data?.message ||
        error.message ||
        "Verification failed";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (!email_input) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const res = await API.post("/auth/resend-code", {
        email: email_input,
      });

      toast.success(res.data.message || "Code resent to your email");
      setCode("");
    } catch (error) {
      setResendCountdown(0);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend code";
      toast.error(message);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        {status === "form" && (
          <>
            <h2>Verify Your Email</h2>
            <p>Enter the verification code sent to your email</p>

            <form className="verify-form" onSubmit={handleVerify}>
              <input
                type="email"
                placeholder="Email Address"
                value={email_input}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={!!email}
                className="verify-input"
                required
              />

              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={handleCodeChange}
                maxLength="6"
                className="verify-input code-input"
                required
              />

              <button type="submit" className="verify-button">
                Verify Email
              </button>
            </form>

            <div className="resend-section">
              <p className="resend-text">
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : "Didn't receive the code?"}
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCountdown > 0}
                className="resend-button"
              >
                Resend Code
              </button>
            </div>

            <p className="back-link">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="link-button"
              >
                Back to Registration
              </button>
            </p>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we confirm your account.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>Your account has been activated successfully.</p>
            <p className="redirect-text">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-icon">✕</div>
            <h2>Verification Failed</h2>
            <p>{errorMessage}</p>
            <button onClick={() => setStatus("form")} className="retry-button">
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
