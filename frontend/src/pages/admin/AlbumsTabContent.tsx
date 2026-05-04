import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import AdminAlbumsTable from "./AdminAlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

export default function AlbumsTabContent() {
  const albums = useSelector((state: RootState) => state.albums?.albums);

  return (
    <div className="sp-admin-table-wrap">
      <div className="sp-admin-table-header">
        <div>
          <div className="sp-admin-table-title">Albums Library</div>
          <div className="sp-admin-table-sub">Manage your albums here.</div>
        </div>
        <AddAlbumDialog />
      </div>

      <table className="sp-admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <AdminAlbumsTable
              key={album._id}
              id={album._id}
              imgUrl={album.imgUrl}
              title={album.title}
              artist={album.artist.name}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
