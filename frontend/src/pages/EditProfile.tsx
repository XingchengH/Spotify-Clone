import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { fetchCurrentUser } from "../store/slices/userSlice";

export default function EditProfile() {
  const dispatch = useDispatch<AppDispath>();
  const profile = useSelector((state: RootState) => state.user.profile);
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) return;
        const res = await axiosInstance.get(`/users/me`);
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
  }, [userId, profile?.imageUrl]);

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
      let imageUrl;

      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append("avatar", avatarFile);

        const res = await axiosInstance.post(
          "/users/uploadAvatar",
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = res.data.url;
      }

      const updatePayload = {
        ...formData,
        ...(imageUrl && { imageUrl }),
      };

      if (!profile?._id) return;

      await axiosInstance.put(`/users/${userId}`, updatePayload);
      dispatch(fetchCurrentUser());
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container-fluid h-100 d-flex flex-column text-white rounded p-4" style={{backgroundColor: "var(--primary-bg-color)", maxWidth: "600px"}}>
      <h2 className="py-2 fw-bold mb-5">Edit Personal Info</h2>
      <form className="form-group" onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <p className="m-0 fw-bold">User ID</p>
          <span>{userId}</span>
        </div>

        <label htmlFor="avatar" className="fw-bold">
          Avatar
        </label>
        <input
          className="form-control mb-2"
          name="avatar"
          type="file"
          id="avatar"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
          }}
        />

        {avatarFile && (
          <img
            className="img-fluid d-block"
            src={URL.createObjectURL(avatarFile)}
            alt="avatar"
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              marginBottom: 10,
            }}
          />
        )}

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
          <button type="submit" className="btn btn-secondary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
