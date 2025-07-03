import type { Song } from "../../../store/slices/songsSlice";
import LoadingSpinner from "../../../components/Spinner";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 fw-bold">{title}</h2>
        <button className="btn btn-link text-secondary text-decoration-none p-0">
          Show all
        </button>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
        {songs.map((song) => (
          <div key={song._id} className="col">
            <div
              className="p-3 rounded bg-dark bg-opacity-50 shadow-sm position-relative"
              style={{ cursor: "pointer", transition: "background 0.3s" }}
              onMouseEnter={(e) =>
                e.currentTarget.classList.add("bg-opacity-75")
              }
              onMouseLeave={(e) =>
                e.currentTarget.classList.remove("bg-opacity-75")
              }
            >
              <div className="mb-3 position-relative">
                <div className="ratio ratio-1x1 rounded overflow-hidden shadow">
                  <img
                    src={song.imgUrl}
                    alt={song.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
                {/* <PlayButton song={song} /> */}
              </div>

              <h3
                className="fw-medium mb-1 text-truncate"
                style={{ maxWidth: "100%" }}
              >
                {song.title}
              </h3>
              <p
                className="text-muted text-truncate"
                style={{ fontSize: "0.9rem", maxWidth: "100%" }}
              >
                {song.artist?.name || "Unknown Artist"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
