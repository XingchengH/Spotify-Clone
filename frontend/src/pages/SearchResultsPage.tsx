import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { AppDispath, RootState } from "../store/store";
import {
  fetchUserLikedSongs,
  toggleLikedSong,
} from "../store/slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
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
        minHeight: "calc(100vh - 73px)",
        overflowY: "auto",
      }}
    >
      <h2 className="my-3">Songs</h2>

      {filteredSongs.length === 0 ? (
        <p>No matching songs found.</p>
      ) : (
        <SongTable
          songs={filteredSongs}
          likedSongIds={likedSongIds}
          onLikeToggle={handleLikeToggle}
        />
      )}
    </div>
  );
};

export default SearchResultPage;
