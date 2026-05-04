import type { Song } from "../../../store/slices/songsSlice";
import LoadingSpinner from "../../../components/Spinner";
import PlayButton from "./PlayButton";
import { useState } from "react";

type FeatureSectionProps = {
  isLoading: boolean;
  songs: Song[];
  error?: string | null;
};

export default function FeatureSection({ isLoading, songs, error }: FeatureSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="sp-error-text">{error}</p>;

  return (
    <div className="sp-feature-grid">
      {songs.map((song) => (
        <div
          key={song._id}
          className="sp-card-row"
          onMouseEnter={() => setHoveredId(song._id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <img
            src={song.imgUrl}
            alt={song.title}
            loading="lazy"
            className="sp-feature-thumb"
          />
          <div className="sp-feature-info">
            <div className="sp-feature-title">{song.title}</div>
            <div className="sp-feature-artist">
              {typeof song.artist === "string" ? "Unknown Artist" : song.artist?.name || "Unknown Artist"}
            </div>
          </div>
          <div className="sp-feature-action">
            <PlayButton song={song} isHover={hoveredId === song._id} />
          </div>
        </div>
      ))}
    </div>
  );
}
