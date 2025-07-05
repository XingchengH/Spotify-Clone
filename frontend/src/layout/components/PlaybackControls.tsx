import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import {
  playNext,
  playPrevious,
  togglePlay,
} from "../../store/slices/usePlayerSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faForward,
  faLaptop,
  faListDots,
  faMicrophone,
  faPause,
  faPlay,
  faRandom,
  faRepeat,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

export default function PlaybackControls() {
  const dispatch = useDispatch<AppDispath>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.playerSongs
  );

  const [valume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    const handleEnded = () => {
      dispatch(togglePlay());
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateTime);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentSong, dispatch]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";

    const rounded = Math.floor(seconds);
    const min = Math.floor(rounded / 60);
    const sec = rounded % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <footer className="d-flex align-items-center justify-content-between p-3 bg-dark text-white rounded">
      <div className="d-flex align-items-center">
        {currentSong && (
          <>
            <img
              src={currentSong.imgUrl}
              alt={currentSong.title}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "5px",
                marginRight: "10px",
                objectFit: "cover",
              }}
            />
            <div>
              <h6 className="mb-0 text-truncate">{currentSong.title}</h6>
              <small className="text-muted text-nowrap">
                {currentSong?.artist?.name || "No song playing"}
              </small>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="d-flex flex-column align-items-center flex-grow-1 w-100 w-sm-45 gap-2">
        <div className="d-flex align-items-center gap-4 gap-sm-3">
          {/* shuffle icon */}
          <button className="btn btn-secondary btn-sm bg-transparent border-0">
            <FontAwesomeIcon icon={faRandom} />
          </button>
          {/* Previous button */}
          <button
            className="btn btn-secondary btn-sm bg-transparent border-0"
            onClick={() => dispatch(playPrevious())}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          <button
            className="btn btn-secondary btn-sm bg-transparent border-0"
            onClick={() => dispatch(togglePlay())}
          >
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>

          {/* Next button */}
          <button
            className="btn btn-secondary btn-sm bg-transparent border-0"
            onClick={() => dispatch(playNext())}
          >
            <FontAwesomeIcon icon={faForward} />
          </button>

          {/* Repeat */}
          <button className="btn btn-secondary btn-sm bg-transparent border-0">
            <FontAwesomeIcon icon={faRepeat} />
          </button>
        </div>

        <div
          className="d-none d-sm-flex align-items-center justify-content-between w-100"
          style={{ maxWidth: "500px" }}
        >
          <div className="text-white">{formatDuration(currentTime)}</div>
          <input
            type="range"
            className="form-range flex-grow-1 mx-2 w-100"
            min={0}
            max={duration || 100}
            step={1}
            value={currentTime}
            onChange={(e) => handleSeek([parseFloat(e.target.value)])}
          />
          <div className="text-white">{formatDuration(duration)}</div>
        </div>
      </div>
      {/* Valume control */}
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-secondary btn-sm bg-transparent border-0">
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
          <button className="btn btn-secondary btn-sm bg-transparent border-0">
            <FontAwesomeIcon icon={faListDots} />
          </button>
          <button className="btn btn-secondary btn-sm bg-transparent border-0">
            <FontAwesomeIcon icon={faLaptop} />
          </button>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-secondary btn-sm bg-transparent border-0">
              <FontAwesomeIcon icon={faVolumeUp} />
            </button>

            <input
              type="range"
              className="form-range"
              min={0}
              max={100}
              step={1}
              value={valume}
              onChange={(value) => {
                setVolume(parseFloat(value.target.value));
                if (audioRef.current) {
                  audioRef.current.volume =
                    parseFloat(value.target.value) / 100;
                }
              }}
              style={{ width: "100px" }}
            />
          </div>
        </div>
      </div>

      {/* Audio Element */}
    </footer>
  );
}
