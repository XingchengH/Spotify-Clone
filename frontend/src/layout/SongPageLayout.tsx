// components/SongPageLayout.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import PlayButton from "../components/button/PlayButton";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface SongPageLayoutProps {
  coverImgUrl: string | undefined;
  typeLabel: string;
  title: string | undefined;
  subtitle?: React.ReactNode;
  songs: any[];
  likedSongIds: Set<string>;
  onLikeToggle: (songId: string) => void;
  formatDuration: (seconds: number) => string;
  showReleaseDate?: boolean;
}

export default function SongPageLayout({
  coverImgUrl,
  typeLabel,
  title,
  subtitle,
  songs,
  likedSongIds,
  onLikeToggle,
  formatDuration,
  showReleaseDate = false,
}: SongPageLayoutProps) {
  return (
    <div className="h-100 overflow-hidden rounded">
      <div
        className="text-white text-break"
        style={{ position: "relative", height: "100%" }}
      >
        <div className="position-relative" style={{ height: "100%" }}>
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              zIndex: 0,
              background:
                "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(40,38,80,0.4), rgba(34, 31, 31, 0.8))",
            }}
            aria-hidden="true"
          />
          <div
            className="position-relative overflow-hidden"
            style={{
              height: "100%",
            }}
          >
            {/* Header */}
            <div className="d-flex p-4 gap-4 pb-4 text-truncate">
              <img
                src={coverImgUrl}
                alt={title}
                className="rounded shadow-lg"
                style={{ width: "240px", height: "240px", objectFit: "cover" }}
              />
              <div className="d-flex flex-column justify-content-end">
                <p className="small fw-medium">{typeLabel}</p>
                <h1
                  className="display-1 fw-bold my-4"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                >
                  {title}
                </h1>
                <div className="d-flex align-items-center small text-white gap-2">
                  {subtitle}
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="px-4 pb-3 d-flex align-items-center gap-3">
              <PlayButton />
            </div>

            {/* Songs Table container */}
            <div
              className="backdrop-blur-sm overflow-auto m-2 rounded text-truncate"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                maxHeight: "45vh", // or use a fixed px value if you want
              }}
            >
              <table className="table table-hover table-borderless text-white align-middle mb-0">
                <thead>
                  <tr>
                    <th className="text-muted fw-normal">#</th>
                    <th className="text-muted fw-normal">Title</th>
                    {showReleaseDate && (
                      <th className="text-muted fw-normal">Released</th>
                    )}
                    <th className="text-end text-muted fw-normal">
                      <FontAwesomeIcon icon={faClock} />
                    </th>
                    <th
                      className="text-end text-muted fw-normal"
                      style={{ width: "50px" }}
                    />
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, index) => (
                    <tr key={song._id} className="bg-transparent">
                      <td className="text-muted">{index + 1}</td>
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
                            <div className="fw-semibold text-white text-truncate">
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
                              likedSongIds.has(song._id)
                                ? solidHeart
                                : regularHeart
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
          </div>
        </div>
      </div>
    </div>
  );
}
