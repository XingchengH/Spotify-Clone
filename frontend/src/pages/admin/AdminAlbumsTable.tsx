import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import type { AppDispath } from "../../store/store";
import { deleteAlbum } from "../../store/slices/albumsSlice";
import toast from "react-hot-toast";

interface Props { imgUrl?: string; id: string; title: string; artist: string; }

export default function AdminAlbumsTable({ imgUrl, title, id, artist }: Props) {
  const dispatch = useDispatch<AppDispath>();

  const handleDelete = async () => {
    try {
      await dispatch(deleteAlbum(id));
      toast.success("Album deleted successfully!");
    } catch {
      toast.error("Failed to delete album.");
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
        <button className="sp-admin-delete-btn" onClick={handleDelete} aria-label="Delete album">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
