import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

interface AdminSongsTableProps {
  imgUrl?: string;
  id: string;
  title: string;
  artist: string;
  onDeleteSuccess?: (deletedId: string) => void;
}

export default function AdminSongsTable({
  imgUrl,
  title,
  id,
  artist,
  onDeleteSuccess,
}: AdminSongsTableProps) {
  const deleteSong = async (songId: string) => {
    try {
      await axiosInstance.delete(`/songs/admin/songs/${songId}`);
      if (onDeleteSuccess) {
        onDeleteSuccess(songId);
      }
    } catch (error) {
      console.error("Error deleting song:", error);
    }
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
