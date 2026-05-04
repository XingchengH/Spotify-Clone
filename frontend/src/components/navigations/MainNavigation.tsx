import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { fetchCurrentUser, logoutAsync } from "../../store/slices/userSlice";
import avg from "../../assets/imgs/dummyAvactor.jpg";
import { resetSongs } from "../../store/slices/songsSlice";
import SearchBar from "../SearchBar";
import ThemeToggle from "../ThemeToggle";
import { resetAlbums } from "../../store/slices/albumsSlice";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

const MainNavigation = () => {
  const dispatch = useDispatch<AppDispath>();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const isAdmin = useSelector((state: RootState) => state.user?.user?.isAdmin);
  const profile = useSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    if (!profile && token) dispatch(fetchCurrentUser());
  }, [dispatch, profile, token]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logoutAsync());
    dispatch(resetAlbums());
    dispatch(resetSongs());
    setMenuOpen(false);
  };

  const menuItems = [
    { label: "Profile", to: "/user/me" },
    { label: "Edit Profile", to: "/account" },
    ...(isAdmin ? [{ label: "Admin Dashboard", to: "/admin" }] : []),
  ];

  return (
    <nav className="sp-nav">
      <Link to="/" className="sp-nav-logo">
        <FontAwesomeIcon icon={faSpotify} />
      </Link>

      <Link to="/" className="sp-nav-home">
        <FontAwesomeIcon icon={faHome} />
      </Link>

      <div className="sp-nav-search-wrapper">
        <SearchBar />
      </div>

      <div className="sp-nav-actions">
        <ThemeToggle />
        {token ? (
          <div className="sp-avatar-menu-wrap" ref={menuRef}>
            <button
              className="sp-avatar-btn"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <img
                src={profile?.imageUrl ? `${profile.imageUrl}?t=${Date.now()}` : avg}
                alt="avatar"
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  key="menu"
                  className="sp-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {menuItems.map(({ label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      className="sp-dropdown-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="sp-dropdown-divider" />
                  <button className="sp-dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link to="/login" className="sp-nav-signin">
              Sign In
            </Link>
            <Link to="/signup" className="sp-btn-primary sp-btn-primary--sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
