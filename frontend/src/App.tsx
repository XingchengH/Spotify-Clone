import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ErrorPage from "./pages/Error";
import Dashboard from "./pages/home/Dashboard";
import User from "./pages/User";
import UserLayout from "./layout/UserLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AlbumPage from "./pages/AlbumPage";
import ProtectedRoute, { AdminRoute } from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "./store/store";
import { useEffect } from "react";
import { fetchSongs } from "./store/slices/songsSlice";
import { fetchAlbums } from "./store/slices/albumsSlice";
import LikeSong from "./pages/LikeSong";
import ArtistPage from "./pages/ArtistPage";
import { fetchUserFollowedArtists, fetchUserLikedSongs } from "./store/slices/userSlice";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import SearchResultsPage from "./pages/SearchResultsPage";
import "./forceCss.css";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";

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
              { index: true, element: <User /> },
              { path: "me", element: <UserProfile /> },
              { path: "likedSong", element: <LikeSong /> },
            ],
          },
          {
            path: "account",
            children: [{ index: true, element: <EditProfile /> }],
          },
          { path: "albums/:albumId", element: <AlbumPage /> },
        ],
      },
      { path: "artist/:artistId", element: <ArtistPage /> },
      { path: "search", element: <SearchResultsPage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [{ path: "admin", element: <AdminPage /> }],
  },
]);

function App() {
  const dispatch = useDispatch<AppDispath>();
  const { token, user, loading } = useSelector((state: RootState) => state.user);
  const songsStatus = useSelector((state: RootState) => state.songs.status);
  const albumsStatus = useSelector((state: RootState) => state.albums.status);
  const likedSongsStatus = useSelector((state: RootState) => state.user.likedSongsStatus);
  const followedArtistsStatus = useSelector((state: RootState) => state.user.followedArtistsStatus);

  useEffect(() => {
    if (!loading && token && user?.id) {
      if (songsStatus === "idle") dispatch(fetchSongs());
      if (albumsStatus === "idle") dispatch(fetchAlbums());
      if (likedSongsStatus === "idle") dispatch(fetchUserLikedSongs());
      if (followedArtistsStatus === "idle") dispatch(fetchUserFollowedArtists());
    }
  }, [loading, token, user?.id, songsStatus, albumsStatus, likedSongsStatus, followedArtistsStatus, dispatch]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster />
    </>
  );
}

export default App;
