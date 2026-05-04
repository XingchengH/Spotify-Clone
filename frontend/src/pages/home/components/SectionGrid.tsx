import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Song } from "../../../store/slices/songsSlice";
import LoadingSpinner from "../../../components/Spinner";
import PlayButton from "./PlayButton";

const COLLAPSED_COUNT = 7;

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  const visible = showAll ? songs : songs.slice(0, COLLAPSED_COUNT);
  const canExpand = songs.length > COLLAPSED_COUNT;

  return (
    <div>
      <div className="sp-section-header">
        <h2 className="sp-section-title">{title}</h2>
        {canExpand && (
          <button className="sp-btn-ghost" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show less" : "Show all"}
          </button>
        )}
      </div>

      <motion.div layout className="sp-grid">
        <AnimatePresence initial={false}>
          {visible.map((song) => (
            <motion.div
              key={song._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="sp-grid-card"
              onMouseEnter={() => setHoveredId(song._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="sp-grid-img-wrap">
                <img
                  src={song.imgUrl}
                  alt={song.title}
                  loading="lazy"
                  className="sp-grid-img"
                />
                <div className="sp-grid-overlay">
                  <PlayButton song={song} size={44} isHover={hoveredId === song._id} />
                </div>
              </div>
              <div className="sp-grid-title">{song.title}</div>
              <div className="sp-grid-artist">{song.artist?.name || "Unknown Artist"}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SectionGrid;
