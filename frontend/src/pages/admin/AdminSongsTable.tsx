import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AdminSongsTableProps {
  imgUrl?: string;
  id: string;
  title: string;
  artist: string;
}

export default function AdminSongsTable({
  imgUrl,
  title,
  id,
  artist,
}: AdminSongsTableProps) {
  const deleteSong = (songId: string) => {
    // todos
    console.log(`Delete song with ID: ${songId}`);
  };

  return (
    <tr>
      <td>
        <img
          src={imgUrl}
          alt={title}
          className="rounded me-3"
          style={{ width: "40px", height: "40px" }}
        />
        {title}
      </td>
      <td>{artist}</td>
      <td>
        <button
          className="btn btn-danger bg-transparent border-0 text-danger"
          onClick={() => deleteSong(id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
