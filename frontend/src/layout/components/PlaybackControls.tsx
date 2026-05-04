import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { playNext, playPrevious, togglePlay } from "../../store/slices/usePlayerSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faPause, faPlay, faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import React from "react";

function PlaybackControls() {
  const dispatch = useDispatch<AppDispath>();
  const { currentSong, isPlaying } = useSelector((state: RootState) => state.playerSongs);

  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration); };
    const onEnded = () => dispatch(togglePlay());

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong, dispatch]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (muted) { audioRef.current.volume = volume / 100; setMuted(false); }
    else { audioRef.current.volume = 0; setMuted(true); }
  };

  const fmt = (s: number) => {
    if (isNaN(s) || s === Infinity) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const seekPct = duration ? `${(currentTime / duration) * 100}%` : "0%";
  const volPct = `${muted ? 0 : volume}%`;

  return (
    <footer className="sp-playbar">
      {/* Left — current song */}
      <div className="sp-playbar-left">
        {currentSong ? (
          <>
            <img src={currentSong.imgUrl} alt={currentSong.title} loading="lazy" className="sp-playbar-thumb" />
            <div className="sp-playbar-song-info">
              <div className="sp-playbar-title">{currentSong.title}</div>
              <div className="sp-playbar-artist">{currentSong.artist?.name}</div>
            </div>
          </>
        ) : (
          <span className="sp-playbar-empty">No song playing</span>
        )}
      </div>

      {/* Center — controls + seek */}
      <div className="sp-playbar-center">
        <div className="sp-playbar-buttons">
          <button className="sp-playbar-ctrl" onClick={() => dispatch(playPrevious())}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button className="sp-playbar-play" onClick={() => dispatch(togglePlay())}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button className="sp-playbar-ctrl" onClick={() => dispatch(playNext())}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        <div className="sp-playbar-seek">
          <span className="sp-time sp-time--left">{fmt(currentTime)}</span>
          <div className="sp-progress-track">
            <div className="sp-progress-bg" />
            <div className="sp-progress-fill" style={{ "--fill": seekPct } as React.CSSProperties} />
            <input type="range" className="sp-progress-input" min={0} max={duration || 100} step={1} value={currentTime} onChange={handleSeek} />
          </div>
          <span className="sp-time sp-time--right">{fmt(duration)}</span>
        </div>
      </div>

      {/* Right — volume */}
      <div className="sp-playbar-right">
        <button className="sp-playbar-ctrl" onClick={toggleMute}>
          <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} />
        </button>
        <div className="sp-volume-track">
          <div className="sp-volume-bg" />
          <div className="sp-volume-fill" style={{ "--fill": volPct } as React.CSSProperties} />
          <input type="range" className="sp-volume-input" min={0} max={100} step={1} value={muted ? 0 : volume} onChange={handleVolume} />
        </div>
      </div>
    </footer>
  );
}

export default React.memo(PlaybackControls);
