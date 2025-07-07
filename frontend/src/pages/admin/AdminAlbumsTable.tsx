import { useDispatch } from "react-redux";
import type { AppDispath } from "../../store/store";
import { deleteAlbum } from "../../store/slices/albumsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

interface AdminAlbumsTableProps {
  imgUrl?: string;
  id: string;
  title: string;
  artist: string;
}

export default function AdminAlbumsTable({
  imgUrl,
  title,
  id,
  artist,
}: AdminAlbumsTableProps) {
  const dispatch = useDispatch<AppDispath>();

  const handleDelete = async (albumId: string) => {
    try {
      await dispatch(deleteAlbum(albumId));
      toast.success("Album deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete album.");
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
