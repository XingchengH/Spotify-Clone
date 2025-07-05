import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import StatsCard from "./StatsCard";
import { faList, faMusic } from "@fortawesome/free-solid-svg-icons";

export default function DashbordStats() {
  const numberOfAlbums = useSelector(
    (state: RootState) => state.albums?.albums?.length || 0
  );
  const numberOfSongs = useSelector(
    (state: RootState) => state.songs?.songs?.length || 0
  );

  return (
    <div className="container-fluid">
      <div className="row my-4 justify-content-center">
        <StatsCard icon={faMusic} label="Total Songs" value={numberOfSongs} />
        <StatsCard icon={faList} label="Total Albums" value={numberOfAlbums} />
      </div>
    </div>
  );
}
