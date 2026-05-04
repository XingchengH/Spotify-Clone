import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import AdminSongsTable from "./AdminSongsTable";
import AddSongDialog from "./AddSongDialog";

export default function SongsTabContent() {
  const songs = useSelector((state: RootState) => state.songs?.songs);

  return (
    <div className="sp-admin-table-wrap">
      <div className="sp-admin-table-header">
        <div>
          <div className="sp-admin-table-title">Songs Library</div>
          <div className="sp-admin-table-sub">Manage your songs here.</div>
        </div>
        <AddSongDialog />
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
          {songs.map((song) => (
            <AdminSongsTable
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
  );
}
