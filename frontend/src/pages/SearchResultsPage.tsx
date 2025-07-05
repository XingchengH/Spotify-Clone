import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import type { AppDispath, RootState } from "../store/store";
import {
  fetchUserLikedSongs,
  toggleLikedSong,
} from "../store/slices/userSlice";
import SongTable from "../components/SongTable";

const SearchResultPage = () => {
  const dispatch = useDispatch<AppDispath>();
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const genre = params.get("genre") ?? "";
  const language = params.get("language") ?? "";

  const songs = useSelector((state: RootState) => state.songs.songs);
  const likedSongs = useSelector((state: RootState) => state.user.likedSongs);
  const likedSongIds = new Set(likedSongs.map((song) => song._id));

  useEffect(() => {
    dispatch(fetchUserLikedSongs());
  }, [dispatch]);

  const handleLikeToggle = (songId: string) => {
    const isLiked = likedSongIds.has(songId);
    dispatch(toggleLikedSong({ songId, liked: isLiked }));
  };

  const filteredSongs = useMemo(() => {
    return songs
      .filter((song) => {
        const matchTitle =
          song.title.toLowerCase().includes(q) ||
          song.artist?.name?.toLowerCase().includes(q);
        const matchGenre = !genre || song.genre === genre;
        const matchLang = !language || song.language === language;
        return matchTitle && matchGenre && matchLang;
      })
      .slice(0, 10);
  }, [songs, q, genre, language]);

  return (
    <div
      className="text-white p-3"
      style={{
        background: "linear-gradient(to bottom,#18181b,rgb(28, 28, 34))",
        minHeight: "calc(100vh - 165px)",
        overflowY: "auto",
      }}
    >
      {filteredSongs.length === 0 ? (
        <p>No matching songs found.</p>
      ) : (
        <>
          <h3>Top Result</h3>
          <div className="my-2 bg-dark p-3 rounded">
            <Link
              to={`/artist/${filteredSongs[0].artist?._id}`}
              className="text-decoration-none text-white"
            >
              <div className="d-flex flex-column align-items-start mb-2 p-2">
                <img
                  src={filteredSongs[0]?.artist?.imgUrl}
                  alt={filteredSongs[0]?.artist?.name}
                  className="rounded-circle me-2"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <span className="display-6">
                  {filteredSongs[0]?.artist?.name}
                </span>
                <small className="text-secondary">Artist</small>
              </div>
            </Link>
          </div>

          <h2 className="my-3">Songs</h2>
          <SongTable
            songs={filteredSongs}
            likedSongIds={likedSongIds}
            onLikeToggle={handleLikeToggle}
          />
        </>
      )}
    </div>
  );
};

export default SearchResultPage;
