import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type PlayButtonProps = {
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: number;
  classes?: string;
};

const PlayButton: React.FC<PlayButtonProps> = ({
  onClick,
  icon,
  size = 56,
  classes,
}) => {
  return (
    <button
      type="button"
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
      onClick={onClick}
    >
      {icon ?? (
        <FontAwesomeIcon
          icon={faPlay}
          className="text-black"
          style={{ width: "14px", height: "28px", lineHeight: 1 }}
        />
      )}
    </button>
  );
};

export default PlayButton;
