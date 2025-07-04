import type { AppDispath, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchUserLikedSongs,
  toggleLikedSong,
} from "../store/slices/userSlice";
import SongPageLayout from "../components/SongPageLayout";

export default function LikedSongs() {
  const dispatch = useDispatch<AppDispath>();
  const likedSongs = useSelector((state: RootState) => state.user.likedSongs);

  useEffect(() => {
    dispatch(fetchUserLikedSongs());
  }, [dispatch]);

  const likedSongIds = new Set(likedSongs.map((song) => song._id));

  const handleLikeToggle = (songId: string) => {
    const isLiked = likedSongIds.has(songId);
    dispatch(toggleLikedSong({ songId, liked: isLiked }));
  };

  return (
    <SongPageLayout
      coverImgUrl="https://misc.scdn.co/liked-songs/liked-songs-300.jpg"
      typeLabel="Playlist"
      title="Liked Songs"
      subtitle={
        <span className="fw-bold text-white">{likedSongs.length} songs</span>
      }
      songs={likedSongs}
      likedSongIds={likedSongIds}
      onLikeToggle={handleLikeToggle}
      showReleaseDate={false}
    />
  );
}
