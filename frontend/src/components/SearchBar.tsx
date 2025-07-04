import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faSearch } from "@fortawesome/free-solid-svg-icons";
import { fetchSongs } from "../store/slices/songsSlice";
import type { AppDispath } from "../store/store";
import { AnimatePresence, motion } from "motion/react";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispath>();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setQuery("");
      setGenreFilter("");
      setLanguageFilter("");
    }
  }, [location.pathname]);

  // Navigate to search with updated filters
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() !== "") {
        const params = new URLSearchParams({
          q: query,
          genre: genreFilter,
          language: languageFilter,
        });
        if (!location.pathname.startsWith("/search")) {
          navigate(`/search?${params.toString()}`);
        } else {
          navigate(`/search?${params.toString()}`, { replace: true });
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [navigate, location.pathname, query, genreFilter, languageFilter]);

  // Showing dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="position-relative"
      style={{ width: "400px" }}
      ref={dropdownRef}
    >
      <form
        className="d-flex bg-dark rounded-pill align-items-center px-3 w-100"
        style={{ border: "1px solid #333" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <FontAwesomeIcon icon={faSearch} color="#ccc" />

        <input
          type="search"
          className="form-control bg-dark text-white border-0 ms-2 text-truncate"
          placeholder="What do you want to play?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
        <button type="button" className="btn btn-link text-white p-0 ms-2">
          <FontAwesomeIcon icon={faMusic} />
        </button>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-dark bg-opacity-75 backdrop-blur text-white p-3 rounded shadow mt-2 position-absolute"
            style={{ zIndex: 10, width: "100%" }}
          >
            <div className="mb-2 d-flex gap-2">
              <select
                className="form-select form-select-sm bg-dark bg-opacity-25 text-white border-secondary"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="">All Genres</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
              </select>

              <select
                className="form-select form-select-sm bg-dark bg-opacity-25 text-white border-secondary"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Korean">Korean</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
              Showing results for: <strong>{query || "..."}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
