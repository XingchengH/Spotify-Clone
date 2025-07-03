import PlaylistSkeleton from "../skeletons/PlaylistSkeleton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { fetchSongs } from "../../store/slices/songsSlice";
import { fetchAlbums } from "../../store/slices/albumsSlice";
import { fetchUserFollowedArtists } from "../../store/slices/userSlice";
import AlbumList from "./AlbumList";
import FollowedArtistList from "./FollowedArtistList";

const LeftSidebar = () => {
  const dispatch = useDispatch<AppDispath>();
  const { status } = useSelector((state: RootState) => state.songs);

  const [viewMode, setViewMode] = useState<"albums" | "artists">("albums");

  const { followedArtists, followedArtistsStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { albums: albumList, status: albumsStatus } = useSelector(
    (state: RootState) => state.albums
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSongs());
    }
    if (albumsStatus === "idle") {
      dispatch(fetchAlbums());
    }

    if (followedArtistsStatus === "idle") {
      dispatch(fetchUserFollowedArtists());
    }
  }, [status, albumsStatus, followedArtistsStatus, dispatch]);

  return (
    <div className="h-100 d-flex flex-column gap-2">
      <div className="flex-grow-1 rounded bg-dark p-3 d-flex flex-column">
        <div className="mb-3 d-flex gap-2 text-truncate">
          <button
            className={`btn btn-sm rounded-pill text-white px-3 ${
              viewMode === "albums"
                ? "btn-primary opacity-100"
                : "btn-outline-primary opacity-50"
            }`}
            onClick={() => setViewMode("albums")}
          >
            Albums
          </button>
          <button
            className={`btn btn-sm rounded-pill text-white px-3 ${
              viewMode === "artists"
                ? "btn-primary opacity-100"
                : "btn-outline-primary opacity-50"
            }`}
            onClick={() => setViewMode("artists")}
          >
            Followed Artists
          </button>
        </div>

        <div
          className="overflow-auto text-white px-2"
          style={{ height: "calc(100vh - 300px)" }}
        >
          {status === "loading" ? (
            <PlaylistSkeleton />
          ) : viewMode === "albums" ? (
            <AlbumList albumList={albumList} />
          ) : (
            <FollowedArtistList artists={followedArtists} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
