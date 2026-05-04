import PlayButton from "./button/PlayButton";
import SongTable from "./SongTable";
import type { Song } from "../store/slices/songsSlice";
import { playAlbum, togglePlay } from "../store/slices/usePlayerSlice";
import type { AppDispath, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";

interface SongPageLayoutProps {
  coverImgUrl: string | undefined;
  typeLabel: string;
  title: string | undefined;
  subtitle?: React.ReactNode;
  songs: Song[];
  likedSongIds: Set<string>;
  onLikeToggle: (songId: string) => void;
  showReleaseDate?: boolean;
}

export default function SongPageLayout({
  coverImgUrl,
  typeLabel,
  title,
  subtitle,
  songs,
  likedSongIds,
  onLikeToggle,
  showReleaseDate = false,
}: SongPageLayoutProps) {
  const dispatch = useDispatch<AppDispath>();
  const { currentSong, isPlaying } = useSelector((state: RootState) => state.playerSongs);

  const handlePlayAlbum = () => {
    if (!songs.length) return;
    const isCurrentAlbumPlaying = songs.some((s) => s._id === currentSong?._id);
    if (isCurrentAlbumPlaying) dispatch(togglePlay());
    else dispatch(playAlbum({ songs, startIdx: 0 }));
  };

  const albumIsPlaying = isPlaying && songs.some((s) => s._id === currentSong?._id);

  return (
    <div className="sp-song-page">
      <div className="sp-song-hero">
        <img src={coverImgUrl} alt={title} className="sp-song-cover" />
        <div className="sp-song-meta">
          <div className="sp-song-type-label">{typeLabel}</div>
          <h1 className="sp-song-title">{title}</h1>
          <div className="sp-song-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="sp-song-controls">
        <PlayButton handlePlayAlbum={handlePlayAlbum} isPlaying={albumIsPlaying} />
      </div>

      <div className="sp-song-tracklist">
        <SongTable
          songs={songs}
          likedSongIds={likedSongIds}
          onLikeToggle={onLikeToggle}
          showReleaseDate={showReleaseDate}
        />
      </div>
    </div>
  );
}
