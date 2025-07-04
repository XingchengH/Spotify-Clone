import type { Song } from "../../../store/slices/songsSlice";
import LoadingSpinner from "../../../components/Spinner";
import PlayButton from "./PlayButton";
import { useState } from "react";

type FeatureSectionProps = {
  isLoading: boolean;
  songs: Song[];
  error?: string | null;
};

export default function FeatureSection({
  isLoading,
  songs,
  error,
}: FeatureSectionProps) {
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <p className="text-danger mb-4 display-4">{error}</p>;

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-4">
      {songs.map((song) => (
        <div key={song._id} className="col">
          <div
            className="d-flex align-items-center bg-dark bg-opacity-50 rounded p-2"
            style={{ cursor: "pointer", transition: "box-shadow 0.3s" }}
            onMouseEnter={(e) => {
              setHoveredSongId(song._id);
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              setHoveredSongId(null);
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <img
              src={song.imgUrl}
              alt={song.title}
              className="rounded me-3"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div className="flex-grow-1 p-2 text-truncate">
              <h6 className="mb-1 text-truncate" style={{ maxWidth: "100%" }}>
                {song.title}
              </h6>
              <small
                className="text-muted text-truncate"
                style={{ maxWidth: "100%" }}
              >
                {/* Safe fallback for artist name */}
                {typeof song.artist === "string"
                  ? "Unknown Artist"
                  : song.artist?.name || "Unknown Artist"}
              </small>
            </div>
            <PlayButton song={song} isHover={hoveredSongId === song._id} />
          </div>
        </div>
      ))}
    </div>
  );
}
