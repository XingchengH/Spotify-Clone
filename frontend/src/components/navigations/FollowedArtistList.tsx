import { Link } from "react-router-dom";

type Artist = {
  _id: string;
  name: string;
  imgUrl?: string;
};

export default function FollowedArtistList({ artists }: { artists: Artist[] }) {
  return (
    <>
      {artists.map((artist) => (
        <Link
          to={`/artist/${artist._id}`}
          key={artist._id}
          className="sp-sidebar-artist"
        >
          {artist.imgUrl ? (
            <img
              src={artist.imgUrl}
              alt={artist.name}
              className="sp-sidebar-artist-img"
            />
          ) : (
            <div className="sp-sidebar-artist-img sp-sidebar-artist-img--placeholder" />
          )}
          <span className="sp-sidebar-artist-name">{artist.name}</span>
        </Link>
      ))}
    </>
  );
}
