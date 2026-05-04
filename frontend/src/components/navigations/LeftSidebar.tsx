import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { fetchSongs } from "../../store/slices/songsSlice";
import { fetchAlbums } from "../../store/slices/albumsSlice";
import { fetchUserFollowedArtists } from "../../store/slices/userSlice";
import AlbumList from "./AlbumList";
import FollowedArtistList from "./FollowedArtistList";
import PlaylistSkeleton from "../skeletons/PlaylistSkeleton";

const LeftSidebar = () => {
  const dispatch = useDispatch<AppDispath>();
  const { status } = useSelector((state: RootState) => state.songs);
  const token = useSelector((state: RootState) => state.user.token);
  const [viewMode, setViewMode] = useState<"albums" | "artists">("albums");
  const { followedArtists, followedArtistsStatus } = useSelector((state: RootState) => state.user);
  const { albums: albumList, status: albumsStatus } = useSelector((state: RootState) => state.albums);

  useEffect(() => {
    if (!token) return;
    if (status === "idle") dispatch(fetchSongs());
    if (albumsStatus === "idle") dispatch(fetchAlbums());
    if (followedArtistsStatus === "idle") dispatch(fetchUserFollowedArtists());
  }, [token, status, albumsStatus, followedArtistsStatus, dispatch]);

  return (
    <div className="sp-sidebar">
      {token && (
        <>
          <div className="sp-sidebar-tabs">
            <div className="sp-sidebar-tabs-inner">
              {(["albums", "artists"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`sp-sidebar-tab${viewMode === mode ? " sp-sidebar-tab--active" : ""}`}
                >
                  {viewMode === mode && (
                    <motion.div
                      layoutId="sidebar-tab-pill"
                      className="sp-sidebar-tab-pill"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="sp-sidebar-tab-label">
                    {mode === "albums" ? "Albums" : "Artists"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sp-sidebar-list">
            {status === "loading" ? (
              <PlaylistSkeleton />
            ) : viewMode === "albums" ? (
              <AlbumList albumList={albumList} />
            ) : (
              <FollowedArtistList artists={followedArtists} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
