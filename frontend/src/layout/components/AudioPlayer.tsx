import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { playNext } from "../../store/slices/usePlayerSlice";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const dispatch = useDispatch<AppDispath>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.playerSongs
  );

  // handle play & pause
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audioEl = audioRef.current;

    const handleEnded = () => {
      dispatch(playNext());
    };

    audioEl?.addEventListener("ended", handleEnded);

    return () => audioEl?.removeEventListener("ended", handleEnded);
  }, [dispatch]);

  // handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audioEl = audioRef.current;

    const isSongChanged = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChanged) {
      audioEl.src = currentSong?.audioUrl;
      audioEl.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;
      if (isPlaying) audioEl.play();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
}
