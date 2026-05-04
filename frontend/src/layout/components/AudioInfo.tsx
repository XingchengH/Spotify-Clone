import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function AudioInfo() {
  const { currentSong } = useSelector((state: RootState) => state.playerSongs);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      setIsTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [currentSong?.title]);

  if (!currentSong) return null;

  return (
    <div className="sp-audio-panel">
      <img
        src={currentSong.imgUrl}
        alt={currentSong.title}
        loading="lazy"
        className="sp-audio-art"
      />

      <div className="sp-audio-text">
        <div className="sp-audio-title-wrap" ref={titleRef}>
          {isTruncated ? (
            <motion.span
              className="sp-audio-title"
              style={{ display: "inline-block" }}
              animate={{ x: [0, -80, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              {currentSong.title}
            </motion.span>
          ) : (
            <span className="sp-audio-title">{currentSong.title}</span>
          )}
        </div>
        <div className="sp-audio-artist">{currentSong.artist.name}</div>
      </div>

      <Link to={`/artist/${currentSong.artist._id}`} className="sp-btn-outline">
        View Artist
      </Link>
    </div>
  );
}
