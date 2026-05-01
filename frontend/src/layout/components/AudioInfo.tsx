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
      const isOverflowing =
        titleRef.current.scrollWidth > titleRef.current.clientWidth;
      setIsTruncated(isOverflowing);
    }
  }, [currentSong?.title]);

  if (!currentSong) return null;

  return (
    <div className="d-flex justify-content-center h-100 bg-dark pt-2">
      <div className="card bg-transparent border-0">
        <img
          src={currentSong.imgUrl}
          alt={currentSong.title}
          loading="lazy"
          className="card-img-top rounded shadow-lg"
          style={{ maxHeight: "200px", width: "auto" }}
        />
        <div className="card-body">
          <div
            ref={titleRef}
            style={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            className="mx-auto"
          >
            {isTruncated ? (
              <motion.h5
                className="card-title text-white m-0"
                style={{ display: "inline-block" }}
                animate={{ x: [0, -100, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                {currentSong.title}
              </motion.h5>
            ) : (
              <h5 className="card-title text-white m-0">{currentSong.title}</h5>
            )}
          </div>

          <p className="card-text">{currentSong.artist.name}</p>
          <Link
            to={`/artist/${currentSong.artist._id}`}
            className="btn btn-primary btn-sm border-0 text-nowrap"
          >
            View Artist
          </Link>
        </div>
      </div>
    </div>
  );
}
