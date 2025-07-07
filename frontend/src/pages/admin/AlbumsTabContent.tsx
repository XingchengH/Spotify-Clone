import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import AdminAlbumsTable from "./AdminAlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

export default function AlbumsTabContent() {
  const albums = useSelector((state: RootState) => state.albums?.albums);

  return (
    <div className="card bg-transparent text-white border-0">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex flex-column">
            <h5 className="card-title">Songs Library</h5>
            <p className="card-text">Manage your Albums here.</p>
          </div>
          <AddAlbumDialog />
        </div>
        <table className="table mt-3 table-bottom text-white">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Artist</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="align-middle">
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
    </div>
  );
}
