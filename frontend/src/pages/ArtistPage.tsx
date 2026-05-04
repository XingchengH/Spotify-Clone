import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../store/store";
import { fetchArtistById } from "../store/slices/artistSlice";
import { fetchSongs, type Song } from "../store/slices/songsSlice";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { fetchUserFollowedArtists, toggleLikedSong } from "../store/slices/userSlice";
import SongTable from "../components/SongTable";

export default function ArtistPage() {
  const { artistId } = useParams();
  const dispatch = useDispatch<AppDispath>();

  const { artistDetail: artist, status } = useSelector((state: RootState) => state.artist);
  const allSongs = useSelector((state: RootState) => state.songs.songs);
  const likedSongs = useSelector((state: RootState) => state.user.likedSongs);
  const likedSongIds = new Set(likedSongs.map((s) => s._id));
  const followedArtists = useSelector((state: RootState) => state.user.followedArtists);
  const isFollowing = followedArtists.some((a) => a._id === artistId);
  const albums = useSelector((state: RootState) => state.albums.albums);

  const artistCoverImgUrl = albums.find((album) => album.artist._id === artistId)?.imgUrl;
  const heroImg = artist?.imgUrl || artistCoverImgUrl;

  useEffect(() => {
    if (artistId) dispatch(fetchArtistById(artistId));
  }, [dispatch, artistId]);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  const artistSongs: Song[] = allSongs.filter((s) => s.artist?._id === artistId);

  const handleLikeToggle = (songId: string) => {
    dispatch(toggleLikedSong({ songId, liked: likedSongIds.has(songId) }));
  };

  const handleFollow = async () => {
    try {
      await axiosInstance.post("users/followArtist", { artistId });
      dispatch(fetchUserFollowedArtists());
    } catch {
      // silent
    }
  };

  if (status === "loading") return <div className="sp-state-msg">Loading artist…</div>;
  if (status === "failed")  return <div className="sp-state-msg sp-state-msg--error">Failed to load artist</div>;
  if (!artist)              return <div className="sp-state-msg">Artist not found</div>;

  return (
    <div className="sp-artist-page">
      {/* Hero banner */}
      <div
        className="sp-artist-hero"
        style={{ backgroundImage: heroImg ? `url(${heroImg})` : undefined }}
      >
        <div className="sp-artist-hero-overlay" />
        <div className="sp-artist-name-wrap">
          <h1 className="sp-artist-name">{artist.name}</h1>
        </div>
      </div>

      {/* Actions */}
      <div className="sp-artist-actions">
        <button
          onClick={handleFollow}
          className={`sp-btn-pill${isFollowing ? " sp-btn-pill--active" : ""}`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {/* Popular tracks */}
      <div className="sp-artist-tracks">
        <h2 className="sp-artist-tracks-heading">Popular</h2>
        {artistSongs.length === 0 ? (
          <p className="sp-state-msg">No songs found for this artist.</p>
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
