import { useEffect, useState } from "react";
import DashbordStats from "./DashboardStats";
import Header from "./Header";
import AlbumsTabContent from "./AlbumsTabContent";
import SongsTabContent from "./SongsTabContent";
import { useDispatch } from "react-redux";
import type { AppDispath } from "../../store/store";
import { fetchSongs } from "../../store/slices/songsSlice";
import { fetchAlbums } from "../../store/slices/albumsSlice";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"albums" | "songs">("albums");

  const dispatch = useDispatch<AppDispath>();

  useEffect(() => {
    dispatch(fetchSongs());
    dispatch(fetchAlbums());
  }, [dispatch]);

  return (
    <div
      className="container-fluid h-100"
      style={{
        background: "linear-gradient(to bottom, var(--primary-color), var(--secondary-bg-color))",
        minHeight: "100vh",
      }}
    >
      <Header />
      <DashbordStats />

      <ul className="nav nav-tabs container mt-3 mb-4">
        <li className="nav-item">
          <button
            className={`nav-link text-white ${activeTab === "albums" ? "active" : ""}`}
            onClick={() => setActiveTab("albums")}
          >
            Albums
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white ${activeTab === "songs" ? "active" : ""}`}
            onClick={() => setActiveTab("songs")}
          >
            Songs
          </button>
        </li>
      </ul>

      <div
        className="bg-dark container rounded-3"
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 380px)",
          minHeight: "300px",
        }}
      >
        {activeTab === "albums" ? (
          <div>
            <AlbumsTabContent />
          </div>
        ) : (
          <div>
            <SongsTabContent />
          </div>
        )}
      </div>
    </div>
  );
}
