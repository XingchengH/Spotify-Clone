import { useDispatch, useSelector } from "react-redux";
import type { Song } from "../../../store/slices/songsSlice";
import type { AppDispath, RootState } from "../../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import {
  setCurrentSong,
  togglePlay,
} from "../../../store/slices/usePlayerSlice";

interface PlayButtonProps {
  song: Song;
  isHover: boolean;
  size?: number;
}

export default function PlayButton({
  song,
  isHover,
  size = 40,
}: PlayButtonProps) {
  const dispatch = useDispatch<AppDispath>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.playerSongs
  );

  const isCurrentSong = currentSong?._id === song?._id;
  const shouldShowPause = isCurrentSong && isPlaying;

  const handlePlay = () => {
    if (isCurrentSong) dispatch(togglePlay());
    else dispatch(setCurrentSong(song));
  };

  return (
    <>
      {isHover || isCurrentSong ? (
        <button
          type="button"
          onClick={handlePlay}
          className={`btn btn-success rounded d-flex justify-content-center align-items-center p-0 ${
            isCurrentSong ? "opacity-100" : "opacity-50"
          }`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transition: "all 0.3s ease",
            backgroundColor: "#28a745",
          }}
        >
          <FontAwesomeIcon
            icon={shouldShowPause ? faPause : faPlay}
            className="text-black"
            style={{ width: "14px", height: "28px", lineHeight: 1 }}
          />
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
