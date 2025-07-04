import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import type { Song } from "../store/slices/songsSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { playAlbum, togglePlay } from "../store/slices/usePlayerSlice";
import { useEffect } from "react";
import { fetchUserLikedSongs } from "../store/slices/userSlice";

const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

type SongTableProps = {
  songs: Song[];
  likedSongIds: Set<string>;
  onLikeToggle: (songId: string) => void;
  showReleaseDate?: boolean;
};

export default function SongTable({
  songs,
  likedSongIds,
  onLikeToggle,
  showReleaseDate = false,
}: SongTableProps) {
  const dispatch = useDispatch<AppDispath>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.playerSongs
  );

  useEffect(() => {
    dispatch(fetchUserLikedSongs());
  }, [dispatch]);

  const handlePlaySong = (idx: number) => {
    if (!songs) return;
    dispatch(playAlbum({ songs, startIdx: idx }));
  };

  return (
    <div
      className="backdrop-blur-sm overflow-auto m-2 rounded text-truncate p-2"
      style={{
        maxHeight: "calc(100vh - 541px)",
      }}
    >
      <table className="table table-hover table-borderless text-white align-middle mb-0 table_custom">
        <thead></thead>
        <tbody>
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?._id === song._id;
            return (
              <tr
                key={song._id}
                className="bg-transparent"
                onClick={() => handlePlaySong(index)}
              >
                {isCurrentSong ? (
                  <td>
                    <FontAwesomeIcon icon={faMusic} />
                  </td>
                ) : (
                  <td className="text-muted">{index + 1}</td>
                )}
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
                      <div
                        className={`fw-semibold text-truncate ${
                          isCurrentSong ? "text-success" : "text-white"
                        }`}
                      >
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
                {showReleaseDate && (
                  <td className="text-muted">
                    {song.createdAt?.split("T")[0]}
                  </td>
                )}
                <td className="text-end text-muted text-truncate">
                  {formatDuration(song.duration)}
                </td>
                <td className="text-end">
                  <motion.span
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeToggle(song._id);
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
