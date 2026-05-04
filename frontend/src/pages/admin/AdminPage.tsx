import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispath } from "../../store/store";
import { fetchSongs } from "../../store/slices/songsSlice";
import { fetchAlbums } from "../../store/slices/albumsSlice";
import DashbordStats from "./DashboardStats";
import AlbumsTabContent from "./AlbumsTabContent";
import SongsTabContent from "./SongsTabContent";
import ThemeToggle from "../../components/ThemeToggle";

const TABS = [
  { key: "albums", label: "Albums" },
  { key: "songs",  label: "Songs"  },
] as const;

type Tab = typeof TABS[number]["key"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("albums");
  const dispatch = useDispatch<AppDispath>();

  useEffect(() => {
    dispatch(fetchSongs());
    dispatch(fetchAlbums());
  }, [dispatch]);

  return (
    <div className="sp-admin-page">
      {/* Header */}
      <header className="sp-admin-header">
        <h1 className="sp-admin-heading">Admin Dashboard</h1>
        <div className="sp-admin-header-actions">
          <ThemeToggle />
          <Link to="/" className="sp-btn-pill">Main</Link>
        </div>
      </header>

      <DashbordStats />

      {/* Tab switcher */}
      <div className="sp-admin-tabs-wrap">
        <div className="sp-admin-tabs">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`sp-admin-tab${activeTab === key ? " sp-admin-tab--active" : ""}`}
            >
              {activeTab === key && (
                <motion.div
                  layoutId="admin-tab-pill"
                  className="sp-admin-tab-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="sp-admin-tab-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="sp-admin-content">
        {activeTab === "albums" ? <AlbumsTabContent /> : <SongsTabContent />}
      </div>
    </div>
  );
}
