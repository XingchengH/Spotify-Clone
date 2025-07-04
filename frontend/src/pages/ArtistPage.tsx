import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { fetchArtistById } from "../store/slices/artistSlice";
import { fetchSongs, type Song } from "../store/slices/songsSlice";
import { useParams } from "react-router-dom";
import PlayButton from "../components/button/PlayButton";
import { axiosInstance } from "../lib/axios";
import {
  fetchUserFollowedArtists,
  toggleLikedSong,
} from "../store/slices/userSlice";
import SongTable from "../components/SongTable";

export default function ArtistPage() {
  const { artistId } = useParams();
  const dispatch = useDispatch<AppDispath>();

  const { artistDetail: artist, status } = useSelector(
    (state: RootState) => state.artist
  );
  const allSongs = useSelector((state: RootState) => state.songs.songs);
  const likedSongs = useSelector((state: RootState) => state.user.likedSongs);
  const likedSongIds = new Set(likedSongs.map((song) => song._id));

  const followedArtists = useSelector(
    (state: RootState) => state.user.followedArtists
  );
  const isFollowing = followedArtists.some((a) => a._id === artistId);

  useEffect(() => {
    if (artistId) dispatch(fetchArtistById(artistId));
  }, [dispatch, artistId]);

  useEffect(() => {
    dispatch(fetchSongs())
  }, [dispatch])


  const artistSongs: Song[] = allSongs.filter(
    (song) => song.artist?._id === artistId
  );

  const handleLikeToggle = (songId: string) => {
    const isLiked = likedSongIds.has(songId);
    dispatch(toggleLikedSong({ songId, liked: isLiked }));
  };

  const handleFollow = async () => {
    try {
      await axiosInstance.post("users/followArtist", { artistId });
      dispatch(fetchUserFollowedArtists());
    } catch (error) {
      console.log("Unable to follow Artist");
    }
  };

  if (status === "loading")
    return <div className="text-white p-3">Loading artist...</div>;
  if (status === "failed")
    return <div className="text-danger p-3">Failed to load artist</div>;
  if (!artist) return <div className="text-white p-3">Artist not found</div>;

  return (
    <div
      className="h-100 overflow-hidden rounded"
      style={{
        zIndex: 0,
        background:
          "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(40,38,80,0.4), rgba(34, 31, 31, 0.8))",
      }}
    >
      {/* Artist banner */}
      <div
        className="w-100 position-relative"
        style={{
          backgroundImage: `url(${artist.imgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          height: "300px",
        }}
      >
        <div
          className="text-white position-absolute"
          style={{ bottom: "30px", left: "20px" }}
        >
          <h1 className="display-1 fw-bold">{artist.name}</h1>
        </div>
      </div>

      {/* Action buttons */}
      <div className="m-3 d-flex gap-3 align-items-center">
        <PlayButton />
        <button
          onClick={handleFollow}
          className="btn btn-outline-primary rounded-pill px-4"
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {/* Song list */}
      <div className="mt-4">
        <p className="fw-bold fs-5" style={{ marginLeft: "16px" }}>
          Popular
        </p>
        {artistSongs.length === 0 ? (
          <p className="text-muted">No songs found for this artist.</p>
        ) : (
          <SongTable
            songs={artistSongs}
            onLikeToggle={handleLikeToggle}
            likedSongIds={likedSongIds}
            showReleaseDate={false}
          />
        )}
      </div>
    </div>
  );
}
