import { Link } from "react-router-dom";

type Album = {
  _id: string;
  title: string;
  imgUrl: string;
  artist?: {
    _id: string;
    name: string;
  };
};

type AlbumListProps = {
  albumList: Album[];
};

export default function AlbumList({ albumList }: AlbumListProps) {
  return (
    <>
      <Link
        to="/user/likedSong"
        className="p-2 mb-2 rounded d-flex align-items-center gap-3 text-decoration-none bg-dark text-white hover-bg"
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://misc.scdn.co/liked-songs/liked-songs-300.jpg"
          alt="Playlist img"
          className="rounded flex-shrink-0"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
          }}
        />
        <div className="d-none d-md-block text-truncate w-100">
          <p className="mb-0 fw-medium text-truncate">Liked Songs</p>
          <small className="text-muted text-truncate d-block">Playlist</small>
        </div>
      </Link>

      {albumList.map((album, index) => (
        <Link
          to={`/albums/${album._id}`}
          key={album._id || index}
          className="p-2 rounded d-flex align-items-center gap-3 text-decoration-none bg-dark text-white hover-bg"
          style={{ cursor: "pointer" }}
        >
          <img
            src={album.imgUrl}
            alt="Playlist img"
            className="rounded flex-shrink-0"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
            }}
          />
          <div className="d-none d-md-block text-truncate w-100">
            <p className="mb-0 fw-medium text-truncate">{album.title}</p>
            <small className="text-muted text-truncate d-block">
              Album • {album.artist?.name || "Unknown Artist"}
            </small>
          </div>
        </Link>
      ))}
    </>
  );
}
