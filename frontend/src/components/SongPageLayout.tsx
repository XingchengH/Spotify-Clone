// components/SongPageLayout.tsx
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
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.playerSongs
  );

  const handlePlayAlbum = () => {
    if (!songs) return;
    const isCurrentAlbumPlaying = songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) dispatch(togglePlay());
    else {
      dispatch(playAlbum({ songs, startIdx: 0 }));
    }
  };

  return (
    <div className="h-100 overflow-hidden rounded">
      <div
        className="text-white text-break"
        style={{ position: "relative", height: "100%" }}
      >
        <div className="position-relative" style={{ height: "100%" }}>
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              zIndex: 0,
              background:
                "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(40,38,80,0.4), rgba(34, 31, 31, 0.8))",
            }}
            aria-hidden="true"
          />
          <div
            className="position-relative overflow-hidden"
            style={{
              height: "100%",
            }}
          >
            {/* Header */}
            <div className="d-flex p-4 gap-4 pb-4 text-truncate">
              <img
                src={coverImgUrl}
                alt={title}
                className="rounded shadow-lg"
                style={{ width: "240px", height: "240px", objectFit: "cover" }}
              />
              <div className="d-flex flex-column justify-content-end">
                <p className="small fw-medium">{typeLabel}</p>
                <h1
                  className="display-1 fw-bold my-4"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                >
                  {title}
                </h1>
                <div className="d-flex align-items-center small text-white gap-2">
                  {subtitle}
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="px-4 pb-3 d-flex align-items-center gap-3">
              <PlayButton
                handlePlayAlbum={handlePlayAlbum}
                isPlaying={
                  isPlaying &&
                  songs.some((song) => song._id === currentSong?._id)
                }
              />
            </div>

            {/* Songs Table container */}
            <SongTable
              songs={songs}
              likedSongIds={likedSongIds}
              onLikeToggle={onLikeToggle}
              showReleaseDate={showReleaseDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function dispatch(arg0: {
  payload: { songs: Song[]; startIdx?: number };
  type: "playerSongs/playAlbum";
}) {
  throw new Error("Function not implemented.");
}
