import { useDispatch, useSelector } from "react-redux";
import type { AppDispath, RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchAlbums } from "../../store/slices/albumsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  const deleteAlbum = (albumId: string) => {
    // todos
    console.log(`Delete album with ID: ${albumId}`);
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
          onClick={() => deleteAlbum(id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
