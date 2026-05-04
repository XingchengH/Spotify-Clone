import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LoadingSpinner from "../components/Spinner";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register", { username, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="sp-auth-page">
      {success && <LoadingSpinner fullscreen text="Redirecting…" />}

      <div className="sp-auth-card">
        <h1 className="sp-auth-heading">Create Account</h1>

        {err && <div className="sp-auth-error">{err}</div>}

        <form className="sp-auth-form" onSubmit={handleSubmit}>
          <div className="sp-field">
            <label className="sp-field-label">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="sp-field-input" />
          </div>
          <div className="sp-field">
            <label className="sp-field-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="sp-field-input" />
          </div>
          <div className="sp-field">
            <label className="sp-field-label">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="sp-field-input" />
          </div>

          <div className="sp-auth-submit">
            <button type="submit" className="sp-btn-primary sp-btn-primary--full">
              Create Account
            </button>
          </div>
        </form>

        <p className="sp-auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
