import { Link } from "react-router-dom";

type Artist = {
  _id: string;
  name: string;
  imgUrl?: string;
};

type FollowedArtistListProps = {
  artists: Artist[];
};

export default function FollowedArtistList({
  artists,
}: FollowedArtistListProps) {
  return (
    <>
      {artists.map((artist) => (
        <Link
          to={`/artist/${artist._id}`}
          key={artist._id}
          className="p-2 rounded d-flex align-items-center gap-3 text-decoration-none bg-dark text-white hover-bg"
        >
          <img
            src={artist.imgUrl}
            alt={`${artist.name} img`}
            className="rounded-circle flex-shrink-0"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <div className="d-none d-md-block text-truncate w-100">
            <p className="mb-0 fw-medium text-truncate">{artist.name}</p>
            <small className="text-muted text-truncate d-block">Artist</small>
          </div>
        </Link>
      ))}
    </>
  );
}
