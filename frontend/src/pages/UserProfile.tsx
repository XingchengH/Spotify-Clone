import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function UserProfile() {
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
      if (!userId) return;
      await axiosInstance.put(`/users/${userId}`, formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center py-2">Edit Profile</h2>
      <form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className="form-control mb-2"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
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
