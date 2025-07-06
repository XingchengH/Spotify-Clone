import { useDispatch, useSelector } from "react-redux";
import AdminSongsTable from "./AdminSongsTable";
import type { AppDispath, RootState } from "../../store/store";
import AddSongDialog from "./AddSongDialog";
import { deleteSong } from "../../store/slices/songsSlice";
import toast from "react-hot-toast";

export default function SongsTabContent() {
  const dispatch = useDispatch<AppDispath>();
  const songs = useSelector((state: RootState) => state.songs?.songs);

  const handleDeleteSuccess = async (songId: string) => {
    try {
      await dispatch(deleteSong(songId));
      toast.success("Song deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete song.");
    }
  };

  return (
    <div className="card bg-transparent text-white border-0">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex flex-column">
            <h5 className="card-title">Songs Library</h5>
            <p className="card-text">Manage your songs here.</p>
          </div>
          <AddSongDialog />
        </div>
        <table className="table mt-3 table_custom table-bottom text-white">
          <thead>
            <tr className="table_custom">
              <th scope="col">Title</th>
              <th scope="col">Artist</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {songs.map((song) => (
              <AdminSongsTable
                onDeleteSuccess={handleDeleteSuccess}
                key={song._id}
                id={song._id}
                imgUrl={song.imgUrl}
                title={song.title}
                artist={song.artist.name}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
