import { useEffect, useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { fetchSongs, type Song } from "../store/slices/songsSlice";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispath>();
  const { songs } = useSelector((state: RootState) => state.songs);

  const [query, setQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredSongs([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const matched = songs.filter((song) => {
      const matchesQuery =
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.name.toLowerCase().includes(lowerQuery);
      const matchesGenre = !genreFilter || song.genre === genreFilter;
      const matchesLanguage =
        !languageFilter || song.language === languageFilter;
      return matchesQuery && matchesGenre && matchesLanguage;
    });

    setFilteredSongs(matched);
    setShowResults(true);
  }, [query, genreFilter, languageFilter, songs]);

  return (
    <div
      className="position-relative"
      style={{ maxWidth: "400px", width: "100%" }}
    >
      <Form
        className="d-flex bg-dark rounded-pill align-items-center px-3 w-100"
        style={{ border: "1px solid #333" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <FontAwesomeIcon icon={faSearch} color="#ccc" />
        <FormControl
          type="search"
          placeholder="What do you want to play?"
          className="bg-dark text-white border-0 ms-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <Button variant="link" className="text-white">
          <FontAwesomeIcon icon={faMusic} />
        </Button>
      </Form>

      {showResults && (
        <div
          className="bg-dark bg-opacity-50 backdrop-blur text-white p-3 rounded shadow mt-2 position-absolute"
          style={{ zIndex: 1000, width: "100%" }}
        >
          <div className="mb-2 d-flex gap-2">
            <select
              className="form-select form-select-sm bg-dark bg-opacity-25 text-white border-secondary"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">All Genres</option>
              <option value="Pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="hiphop">Hip-Hop</option>
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

          {filteredSongs.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {filteredSongs.map((song) => (
                <li
                  key={song._id}
                  className="py-2 border-bottom border-secondary"
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faMusic} className="me-2" />
                  <p className="d-inline">
                    {song.title} –{" "}
                    <span
                      style={{ fontStyle: "italic", fontWeight: "lighter" }}
                    >
                      {song.artist?.name || "Unknow Artist"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-0 text-muted">No matching songs found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
