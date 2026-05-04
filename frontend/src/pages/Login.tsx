import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { login } from "../store/slices/userSlice";
import LoadingSpinner from "../components/Spinner";
import type { RootState } from "../store/store";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.token) navigate("/");
  }, [user.token, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(login({ token: res.data.token }));
    } catch (error: any) {
      setErr(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="sp-auth-page">
      {loading && <LoadingSpinner fullscreen text="Signing in…" />}

      <div className="sp-auth-card">
        <h1 className="sp-auth-heading">Sign In</h1>

        {err && <div className="sp-auth-error">{err}</div>}

        <form className="sp-auth-form" onSubmit={handleSubmit}>
          <div className="sp-field">
            <label className="sp-field-label">Email</label>
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sp-field-input"
            />
          </div>

          <div className="sp-field">
            <label className="sp-field-label">Password</label>
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sp-field-input"
            />
          </div>

          <div className="sp-auth-submit">
            <button
              type="submit"
              disabled={loading}
              className="sp-btn-primary sp-btn-primary--full"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </form>

        <p className="sp-auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
