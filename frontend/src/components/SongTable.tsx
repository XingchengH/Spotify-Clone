import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import type { Song } from "../store/slices/songsSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { playAlbum } from "../store/slices/usePlayerSlice";

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  return `${m}:${(seconds % 60).toString().padStart(2, "0")}`;
};

type SongTableProps = {
  songs: Song[];
  likedSongIds: Set<string>;
  onLikeToggle: (songId: string) => void;
  showReleaseDate?: boolean;
};

function SongTable({ songs, likedSongIds, onLikeToggle, showReleaseDate = false }: SongTableProps) {
  const dispatch = useDispatch<AppDispath>();
  const { currentSong } = useSelector((state: RootState) => state.playerSongs);
  const handlePlay = (idx: number) => {
    if (songs.length) dispatch(playAlbum({ songs, startIdx: idx }));
  };

  return (
    <div className="sp-track-list">
      {songs.map((song, index) => {
        const isActive = currentSong?._id === song._id;
        const isLiked = likedSongIds.has(song._id);

        return (
          <div
            key={song._id}
            className="sp-track-row"
            onClick={() => handlePlay(index)}
          >
            <div className={`sp-track-num${isActive ? " sp-track-num--active" : ""}`}>
              {isActive
                ? <FontAwesomeIcon icon={faMusic} style={{ fontSize: "12px" }} />
                : index + 1}
            </div>

            <div className="sp-track-info">
              <img
                src={song.imgUrl}
                alt={song.title}
                loading="lazy"
                className="sp-track-thumb"
              />
              <div style={{ minWidth: 0 }}>
                <div className={`sp-track-title${isActive ? " sp-track-title--active" : ""}`}>
                  {song.title}
                </div>
                {song.artist && (
                  <Link
                    to={`/artist/${typeof song.artist === "string" ? song.artist : song.artist._id}`}
                    className="sp-track-artist"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {typeof song.artist === "string" ? song.artist : song.artist.name}
                  </Link>
                )}
                {showReleaseDate && (
                  <div className="sp-track-date">{song.createdAt?.split("T")[0]}</div>
                )}
              </div>
            </div>

            <div className="sp-track-duration">{formatDuration(song.duration)}</div>

            <motion.button
              className={`sp-track-like${isLiked ? " sp-track-like--liked" : ""}`}
              onClick={(e) => { e.stopPropagation(); onLikeToggle(song._id); }}
              whileTap={{ scale: 1.3, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <FontAwesomeIcon icon={isLiked ? solidHeart : regularHeart} />
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(SongTable);
