import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import type { AppDispath } from "../../store/store";
import { deleteSong } from "../../store/slices/songsSlice";
import toast from "react-hot-toast";

interface Props { imgUrl?: string; id: string; title: string; artist: string; }

export default function AdminSongsTable({ imgUrl, title, id, artist }: Props) {
  const dispatch = useDispatch<AppDispath>();

  const handleDelete = async () => {
    try {
      await dispatch(deleteSong(id));
      toast.success("Song deleted successfully!");
    } catch {
      toast.error("Failed to delete song.");
    }
  };

  return (
    <tr className="sp-admin-table-row">
      <td className="sp-admin-table-cell sp-admin-table-cell--title">
        {imgUrl && <img src={imgUrl} alt={title} className="sp-admin-table-img" />}
        {title}
      </td>
      <td className="sp-admin-table-cell">{artist}</td>
      <td className="sp-admin-table-cell">
        <button className="sp-admin-delete-btn" onClick={handleDelete} aria-label="Delete song">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
