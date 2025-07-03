import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ErrorPage from "./pages/Error";
import Dashboard from "./pages/home/Dashboard";
import User from "./pages/User";
import UserLayout from "./layout/UserLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AlbumPage from "./pages/AlbumPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "./store/store";
import { useEffect } from "react";
import {
  fetchFeaturedSongs,
  fetchMadeForYouSongs,
  fetchSongs,
  fetchTrendingSongs,
} from "./store/slices/songsSlice";
import { fetchAlbums } from "./store/slices/albumsSlice";
import LikeSong from "./pages/LikeSong";
import ArtistPage from "./pages/ArtistPage";
import { fetchUserFollowedArtists } from "./store/slices/userSlice";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";

function App() {
  const dispatch = useDispatch<AppDispath>();
  const { token, user, loading } = useSelector(
    (state: RootState) => state.user
  );
  const {
    status: songsStatus,
    featuredStatus,
    madeForYouStatus,
    trendingStatus,
  } = useSelector((state: RootState) => state.songs);

  useEffect(() => {
    if (!loading && token && user?.id) {
      if (songsStatus === "idle") dispatch(fetchSongs());
      if (featuredStatus === "idle") dispatch(fetchFeaturedSongs());
      if (madeForYouStatus === "idle") dispatch(fetchMadeForYouSongs());
      if (trendingStatus === "idle") dispatch(fetchTrendingSongs());
      dispatch(fetchAlbums());
      dispatch(fetchUserFollowedArtists());
    }
  }, [
    loading,
    token,
    user?.id,
    songsStatus,
    featuredStatus,
    madeForYouStatus,
    trendingStatus,
    dispatch,
  ]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Signup /> },

        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "user",
              element: <UserLayout />,
              children: [
                {
                  index: true,
                  element: <User />,
                },
                {
                  path: "me",
                  element: <UserProfile />,
                },
                { path: "likedSong", element: <LikeSong /> },
              ],
            },
            {
              path: "account",
              children: [
                {
                  index: true,
                  element: <EditProfile />,
                },
              ],
            },
            {
              path: "albums/:albumId",
              element: <AlbumPage />,
            },
          ],
        },
        { path: "artist/:artistId", element: <ArtistPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
