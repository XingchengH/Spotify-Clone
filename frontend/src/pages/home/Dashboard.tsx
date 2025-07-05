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
import { initializeQueue } from "../../store/slices/usePlayerSlice";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispath>();

  const {
    madeForYou,
    trending,
    madeForYouStatus,
    trendingStatus,
    featured,
    featuredStatus,
  } = useSelector((state: RootState) => state.songs);
  const userId = useSelector((state: RootState) => state.user.user?.id);

  const queue = useSelector((state: RootState) => state.playerSongs.queue);

  useEffect(() => {
    if (featuredStatus === "idle") {
      dispatch(fetchFeaturedSongs());
    }

    if (madeForYouStatus === "idle") {
      dispatch(fetchMadeForYouSongs());
    }
    if (trendingStatus === "idle") {
      dispatch(fetchTrendingSongs());
    }
  }, [dispatch, featuredStatus, madeForYouStatus, trendingStatus]);

  useEffect(() => {
    if (
      madeForYou.length > 0 &&
      featured.length > 0 &&
      trending.length > 0 &&
      queue.length === 0
    ) {
      const allSongs = [...madeForYou, ...featured, ...trending];
      dispatch(initializeQueue(allSongs));
    }
  }, [madeForYou, featured, trending, queue, dispatch]);

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
      <div className="overflow-auto" style={{ height: "calc(100vh - 165px)" }}>
        <div className="p-4 p-sm-6">
          <h1 className="display-5 fw-bold mb-4">{greeting}</h1>
          {userId && (
            <FeatureSection
              isLoading={featuredStatus === "loading"}
              songs={featured}
            />
          )}
        </div>

        <div className="px-4 px-sm-6 mb-4">
          {userId && (
            <SectionGrid
              title="Made for You"
              isLoading={madeForYouStatus === "loading"}
              songs={madeForYou}
            />
          )}

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
