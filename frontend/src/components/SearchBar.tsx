import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { fetchSongs } from "../store/slices/songsSlice";
import type { AppDispath } from "../store/store";
import { AnimatePresence, motion } from "motion/react";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispath>();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const songsStatus = useSelector((state: RootState) => state.songs.status);

  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (songsStatus === "idle") dispatch(fetchSongs());
  }, [dispatch, songsStatus]);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setQuery(""); setGenreFilter(""); setLanguageFilter("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        const params = new URLSearchParams({ q: query, genre: genreFilter, language: languageFilter });
        if (!location.pathname.startsWith("/search")) navigate(`/search?${params}`);
        else navigate(`/search?${params}`, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [navigate, location.pathname, query, genreFilter, languageFilter]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="sp-search-wrap" ref={dropdownRef}>
      <div className="sp-search-field">
        <FontAwesomeIcon icon={faSearch} className="sp-search-icon" />
        <input
          type="search"
          className="sp-search-input"
          placeholder="What do you want to play?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="sp-search-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <div className="sp-search-filters">
              <select className="sp-search-select" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                <option value="">All Genres</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
              </select>
              <select className="sp-search-select" value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Korean">Korean</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <p className="sp-search-hint">
              {query ? `Results for "${query}"` : "Start typing to search"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
