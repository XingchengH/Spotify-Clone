import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
      await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }} className="mt-5">
      <h2 className="mb-4">Sign Up</h2>
      {err && <Alert variant="danger">{err}</Alert>}
      {success && (
        <LoadingSpinner fullscreen text="Redirecting..." />
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}
