import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeaturedSongs,
  fetchMadeForYouSongs,
  fetchTrendingSongs,
} from "../../store/slices/songsSlice";
import type { AppDispath, RootState } from "../../store/store";
import FeatureSection from "./components/FeatureSection";
import SectionGrid from "./components/SectionGrid";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispath>();

  const { madeForYou, trending, madeForYouStatus, trendingStatus } =
    useSelector((state: RootState) => state.songs);

  useEffect(() => {
    dispatch(fetchFeaturedSongs());
    dispatch(fetchMadeForYouSongs());
    dispatch(fetchTrendingSongs());
  }, [dispatch]);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <main
      className="rounded overflow-hidden h-100"
      style={{
        background: "linear-gradient(to bottom,#18181b,rgb(28, 28, 34))",
      }}
    >
      <div className="overflow-auto" style={{ height: "calc(100vh - 180px)" }}>
        <div className="p-4 p-sm-6">
          <h1 className="display-5 fw-bold mb-4">{greeting}</h1>
          <FeatureSection />
        </div>

        <div className="px-4 px-sm-6 mb-4">
          <SectionGrid
            title="Made for You"
            isLoading={madeForYouStatus === "loading"}
            songs={madeForYou}
          />
          <SectionGrid
            title="Trending"
            isLoading={trendingStatus === "loading"}
            songs={trending}
          />
        </div>
      </div>
    </main>
  );
}
