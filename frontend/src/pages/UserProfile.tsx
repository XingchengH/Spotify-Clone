import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/slices/userSlice";
import type { AppDispath, RootState } from "../store/store";
import fakeAva from "../assets/imgs/dummyAvactor.jpg";

export default function UserProfile() {
  const dispatch = useDispatch<AppDispath>();
  const profile = useSelector((state: RootState) => state.user.profile);
  const loading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    if (!profile && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, profile, loading]);

  if (loading) return <p>Loading user...</p>;
  if (!profile) return <p>No user found.</p>;

  return (
    <div
      className="h-100 overflow-hidden rounded"
      style={{ position: "relative", height: "100%" }}
    >
      <div
        className="osition-relative h-100"
        style={{
          zIndex: 0,
          background:
            "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(34,31,31,0.8))",
        }}
        aria-hidden="true"
      >
        <div className="position-relative overflow-hidden h-100">
          <div className="d-flex p-4 gap-4 pb-4 text-truncate">
            <img
              src={fakeAva}
              alt="Fake ava"
              className="rounded-circle shadow-lg"
              style={{ width: "240px", height: "240px", objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-end">
              <p className="small fw-medium">Profile</p>
              <h1
                className="display-1 fw-bold my-4"
                style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              >
                {profile.username}
              </h1>
              <div className="d-flex align-items-center small text-white gap-2">
                {profile.likedSongs.length} like songs •{" "}
                {profile.followedArtists.length} follwing artists
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
