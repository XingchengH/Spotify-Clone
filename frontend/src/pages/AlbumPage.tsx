import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { fetchAlbumById } from "../store/slices/albumsSlice";
import { toggleLikedSong } from "../store/slices/userSlice";
import LoadingSpinner from "../components/Spinner";
import SongPageLayout from "../components/SongPageLayout";

export default function AlbumPage() {
  const { albumId } = useParams();
  const dispatch = useDispatch<AppDispath>();

  const { selectedAlbum, selectedAlbumStatus } = useSelector(
    (state: RootState) => state.albums
  );

  // Get liked songs from user slice
  const likedSongs = useSelector((state: RootState) => state.user.likedSongs);
  // Create a Set for efficient lookup
  const likedSongIds = new Set(likedSongs.map((song) => song._id));

  // Fetch album
  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbumById(albumId));
    }
  }, [dispatch, albumId]);

  // Handle like toggle
  const handleLikeToggle = (songId: string) => {
    const liked = likedSongIds.has(songId);
    dispatch(toggleLikedSong({ songId, liked }));
  };

  if (selectedAlbumStatus === "loading") {
    return <LoadingSpinner size="sm" />;
  }

  return (
    <SongPageLayout
      coverImgUrl={selectedAlbum?.imgUrl}
      typeLabel="Album"
      title={selectedAlbum?.title}
      subtitle={
        <>
          <span className="fw-bold text-white">
            {selectedAlbum?.artist?.name} •
          </span>
          <span>{selectedAlbum?.songs?.length} songs •</span>
          <span className="fw-medium text-white">
            {selectedAlbum?.artist?.name}
          </span>
          <span>{selectedAlbum?.releaseYear}</span>
        </>
      }
      songs={selectedAlbum?.songs || []}
      likedSongIds={likedSongIds}
      onLikeToggle={handleLikeToggle}
      showReleaseDate={true}
    />
  );
}
