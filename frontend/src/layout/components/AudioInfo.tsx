import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link } from "react-router-dom";

export default function AudioInfo() {
  const { currentSong } = useSelector((state: RootState) => state.playerSongs);

  if (!currentSong) return null;

  return (
    <div className="d-flex justify-content-center h-100 bg-dark pt-2">
      <div className="card bg-transparent border-0">
        <img
          src={currentSong.imgUrl}
          alt={currentSong.title}
          className="card-img-top rounded shadow-lg"
          style={{ maxHeight: "200px", width: "auto" }}
        />
        <div className="card-body">
          <h5 className="card-title">{currentSong.title}</h5>
          <p className="card-text">{currentSong.artist.name}</p>
          <Link
            to={`/artist/${currentSong.artist._id}`}
            className="btn btn-primary btn-sm border-0 text-nowrap"
          >
            View Artist
          </Link>
        </div>
      </div>
    </div>
  );
}
