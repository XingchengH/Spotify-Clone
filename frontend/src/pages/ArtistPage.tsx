import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import type { AppDispath, RootState } from "../store/store";
import { fetchArtistById } from "../store/slices/artistSlice";
import PlayButton from "../components/button/PlayButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import type { Song } from "../store/slices/songsSlice";
import {
  fetchUserFollowedArtists,
  toggleLikedSong,
} from "../store/slices/userSlice";
import { axiosInstance } from "../lib/axios";

export default function ArtistPage() {
  const { artistId } = useParams();
  const dispatch = useDispatch<AppDispath>();
  const { artistDetail: artist, status } = useSelector(
    (state: RootState) => state.artist
  );
  const allSongs = useSelector((state: RootState) => state.songs.songs);
  const likedSongIds = useSelector(
    (state: RootState) => state?.user?.likedSongs ?? []
  );

  const followedArtists = useSelector(
    (state: RootState) => state.user.followedArtists
  );

  const isFollowing = followedArtists.some((a) => a._id === artistId);

  useEffect(() => {
    if (artistId) dispatch(fetchArtistById(artistId));
  }, [dispatch, artistId]);

  if (status === "loading")
    return <div className="text-white p-3">Loading artist...</div>;
  if (status === "failed")
    return <div className="text-danger p-3">Failed to load artist</div>;
  if (!artist) return <div className="text-white p-3">Artist not found</div>;

  const artistSongs: Song[] = allSongs.filter(
    (song) => song.artist?._id === artistId
  );

  const formatDuration = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleLikeToggle = (songId: string) => {
    const isLiked = likedSongIds.includes(songId);
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
          backgroundPosition: "center",
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
      <div className="p-3">
        <p className="fw-bold fs-5">Popular</p>
        {artistSongs.length === 0 ? (
          <p className="text-muted">No songs found for this artist.</p>
        ) : (
          <div
            className="backdrop-blur-sm overflow-auto m-2 rounded"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              maxHeight: "45vh",
            }}
          >
            <table className="table table-hover table-borderless text-white align-middle mb-0">
              <tbody>
                {artistSongs.map((song, index) => (
                  <tr key={song._id} className="bg-transparent">
                    <td className="text-muted">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={song.imgUrl}
                          alt={song.title}
                          className="rounded"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div className="fw-semibold text-white text-truncate">
                            {song.title}
                          </div>
                          <div className="text-muted small text-truncate">
                            <Link
                              to={`/artist/${artist._id}`}
                              className="text-decoration-none text-muted"
                            >
                              {artist.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-end text-muted">
                      {formatDuration(song.duration)}
                    </td>
                    <td className="text-end">
                      <motion.span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeToggle(song._id);
                        }}
                        whileTap={{ scale: 1.3, rotate: 10 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 10,
                        }}
                        style={{ cursor: "pointer", display: "inline-block" }}
                      >
                        <FontAwesomeIcon
                          icon={
                            likedSongIds.includes(song._id)
                              ? solidHeart
                              : regularHeart
                          }
                          className={`me-2 ${
                            likedSongIds.includes(song._id)
                              ? "text-danger"
                              : "text-white"
                          }`}
                        />
                      </motion.span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
