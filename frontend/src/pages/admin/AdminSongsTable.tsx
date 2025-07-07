import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosInstance } from "../../lib/axios";
import { useDispatch } from "react-redux";
import type { AppDispath } from "../../store/store";
import { deleteSong } from "../../store/slices/songsSlice";
import toast from "react-hot-toast";

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
  const dispatch = useDispatch<AppDispath>();

  const handleDelete = async (songId: string) => {
    try {
      await dispatch(deleteSong(songId));
      toast.success("Song deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete song.");
    }
  };

  return (
    <tr className="hover-bg cursor-pointer">
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
          onClick={() => handleDelete(id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
