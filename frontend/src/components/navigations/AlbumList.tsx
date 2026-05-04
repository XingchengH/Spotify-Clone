import { Link } from "react-router-dom";

type Album = {
  _id: string;
  title: string;
  imgUrl: string;
  artist?: { _id: string; name: string };
};

export default function AlbumList({ albumList }: { albumList: Album[] }) {
  return (
    <div className="sp-sidebar-list-inner">
      <Link to="/user/likedSong" className="sp-sidebar-row">
        <img
          src="https://misc.scdn.co/liked-songs/liked-songs-300.jpg"
          alt="Liked Songs"
          className="sp-sidebar-row-img"
        />
        <div className="sp-sidebar-row-info">
          <span className="sp-sidebar-row-title">Liked Songs</span>
          <span className="sp-sidebar-row-sub">Playlist</span>
        </div>
      </Link>

      {albumList.map((album, index) => (
        <Link
          to={`/albums/${album._id}`}
          key={album._id || index}
          className="sp-sidebar-row"
        >
          <img
            src={album.imgUrl}
            alt={album.title}
            className="sp-sidebar-row-img"
          />
          <div className="sp-sidebar-row-info">
            <span className="sp-sidebar-row-title">{album.title}</span>
            <span className="sp-sidebar-row-sub">
              Album • {album.artist?.name || "Unknown Artist"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
