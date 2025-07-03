import { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance, updateApiToken } from "../lib/axios";
import { login } from "../store/slices/userSlice";
import LoadingSpinner from "../components/Spinner";
import type { RootState } from "../store/store";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.token) {
      navigate("/");
    }
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
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      dispatch(login({ token: res.data.token }));
    } catch (error: any) {
      setErr(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }} className="mt-5 position-relative">
      {loading && <LoadingSpinner fullscreen text="Logging in..." />}

      <h2 className="mb-4">Login</h2>
      {err && <Alert variant="danger">{err}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </Form>
    </Container>
  );
}
