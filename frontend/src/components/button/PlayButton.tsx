import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

type PlayButtonProps = {
  icon?: React.ReactNode;
  size?: number;
  isPlaying?: boolean;
  handlePlayAlbum?: () => void;
  classes?: string;
};

const PlayButton: React.FC<PlayButtonProps> = ({
  handlePlayAlbum,
  isPlaying,
  icon,
  size = 56,
  classes,
}) => {
  return (
    <button
      type="button"
      onClick={handlePlayAlbum}
      className={`btn btn-success rounded-circle d-flex justify-content-center align-items-center p-0 ${classes}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#28a745cc";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#28a745";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {icon ?? (
        <FontAwesomeIcon
          icon={isPlaying ? faPause : faPlay}
          className="text-black"
          style={{ width: "14px", height: "28px", lineHeight: 1 }}
        />
      )}
    </button>
  );
};

export default PlayButton;
