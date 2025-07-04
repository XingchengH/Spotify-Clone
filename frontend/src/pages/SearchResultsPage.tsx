import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { AppDispath, RootState } from "../store/store";
import {
  fetchUserLikedSongs,
  toggleLikedSong,
} from "../store/slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const SearchResultPage = () => {
  const dispatch = useDispatch<AppDispath>();
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const genre = params.get("genre") ?? "";
  const language = params.get("language") ?? "";

  const songs = useSelector((state: RootState) => state.songs.songs);
  const likedSongs = useSelector((state: RootState) => state.user.likedSongs);
  const likedSongIds = new Set(likedSongs.map((song) => song._id));

  useEffect(() => {
    dispatch(fetchUserLikedSongs());
  }, [dispatch]);

  const handleLikeToggle = (songId: string) => {
    const isLiked = likedSongIds.has(songId);
    dispatch(toggleLikedSong({ songId, liked: isLiked }));
  };

  const formatDuration = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const filteredSongs = useMemo(() => {
    return songs
      .filter((song) => {
        const matchTitle =
          song.title.toLowerCase().includes(q) ||
          song.artist?.name?.toLowerCase().includes(q);
        const matchGenre = !genre || song.genre === genre;
        const matchLang = !language || song.language === language;
        return matchTitle && matchGenre && matchLang;
      })
      .slice(0, 10);
  }, [songs, q, genre, language]);

  return (
    <div
      className="text-white p-3"
      style={{
        background: "linear-gradient(to bottom,#18181b,rgb(28, 28, 34))",
        minHeight: "calc(100vh - 73px)",
        overflowY: "auto",
      }}
    >
      <h2 className="mb-3">Songs</h2>

      {filteredSongs.length === 0 ? (
        <p>No matching songs found.</p>
      ) : (
        <div className="overflow-auto rounded">
          <table className="table table-hover table-borderless text-white align-middle table_custom">
            <tbody>
              {filteredSongs.map((song, index) => (
                <tr key={song._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={song.imgUrl}
                        alt={song.title}
                        className="rounded"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div className="text-white text-truncate">
                          {song.title}
                        </div>
                        {song.artist && (
                          <div className="text-muted small text-truncate">
                            <Link
                              to={`/artist/${
                                typeof song.artist === "string"
                                  ? song.artist
                                  : song.artist._id
                              }`}
                              className="text-decoration-none text-muted"
                            >
                              {typeof song.artist === "string"
                                ? song.artist
                                : song.artist.name}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="text-end text-muted">
                    {formatDuration(song.duration)}
                  </td>
                  <td className="text-end">
                    <motion.span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeToggle(song._id);
                      }}
                      whileTap={{ scale: 1.3, rotate: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <FontAwesomeIcon
                        icon={
                          likedSongIds.has(song._id) ? solidHeart : regularHeart
                        }
                        className={`me-2 ${
                          likedSongIds.has(song._id)
                            ? "text-danger"
                            : "text-white"
                        }`}
                      />
                    </motion.span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;
