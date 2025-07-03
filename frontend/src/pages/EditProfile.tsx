import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function EditProfile() {
  const profile = useSelector((state: RootState) => state.user.profile);
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) return;
        const res = await axiosInstance.get(`/users/${userId}`);
        const { username = "", email = "" } = res.data;
        setFormData((prev) => ({
          ...prev,
          username,
          email,
        }));
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profile?._id) return;
      await axiosInstance.put(`/users/${userId}`, formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="container mt-5 d-flex flex-column">
      <h2 className="py-2 fw-bold mb-5">Edit Personal Info</h2>
      <form className="form-group" onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <p className="m-0 fw-bold">User ID</p>
          <span>{userId}</span>
        </div>

        <label htmlFor="username" className="fw-bold">
          Username
        </label>
        <input
          className="form-control mb-2"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />

        <label htmlFor="email" className="fw-bold">
          Email
        </label>
        <input
          className="form-control mb-2"
          name="email"
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <label htmlFor="password" className="fw-bold">
          Password
        </label>
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
          autoComplete="new-password"
        />
        <div className="d-grid">
          <button type="submit" className="btn btn-success">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
