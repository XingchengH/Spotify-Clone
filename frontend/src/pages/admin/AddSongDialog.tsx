import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

interface NewSong {
  title: string;
  artist: string;
  album: string;
  duration: number;
}

export default function AddSongDialog() {
  const albums = useSelector((state: RootState) => state.albums?.albums);

  const [songDialogOpen, setSongDialogOpen] = useState(false);

  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    album: "",
    duration: 0,
  });

  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (files.audio) {
      const audio = document.createElement("audio");
      audio.src = URL.createObjectURL(files.audio);
      audio.addEventListener("loadedmetadata", () => {
        setNewSong((prev) => ({
          ...prev,
          duration: Math.floor(audio.duration),
        }));
      });
    }
  }, [files.audio]);

  const handleSubmit = async () => {
    try {
      if (!files.audio || !files.image) {
        return toast.error("Please select both audio and image files.");
      }

      const formData = new FormData();

      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration.toString());
      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }
      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);

      await axiosInstance.post("/songs/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: 0,
      });

      setFiles({
        audio: null,
        image: null,
      });

      toast.success("Song added successfully!");
    } catch (error) {
      console.error(
        "Error adding song:",
        error.response?.data || error.message
      );
      toast.error("Failed to add song. Please try again.");
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setSongDialogOpen(true)}
      >
        Add Song
      </button>

      {songDialogOpen && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          onClick={() => setSongDialogOpen(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Add New Song</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSongDialogOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={newSong.title}
                      onChange={(e) =>
                        setNewSong({ ...newSong, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Artist</label>
                    <input
                      type="text"
                      className="form-control"
                      name="artist"
                      value={newSong.artist}
                      onChange={(e) =>
                        setNewSong({ ...newSong, artist: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Album</label>
                    <select
                      className="form-select"
                      name="album"
                      value={newSong.album}
                      onChange={(e) =>
                        setNewSong({ ...newSong, album: e.target.value })
                      }
                    >
                      <option value="">Select album</option>
                      {albums?.map((album) => (
                        <option key={album._id} value={album._id}>
                          {album.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Audio File</label>
                    <input
                      type="file"
                      className="form-control"
                      name="audio"
                      accept="audio/*"
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          audio: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </div>
                  {files.audio && (
                    <div className="mb-3">
                      <audio
                        ref={audioRef}
                        controls
                        src={URL.createObjectURL(files.audio)}
                        style={{ width: "100%" }}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {newSong.duration > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">
                        Duration: {newSong.duration}s
                      </small>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Image File</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        setFiles({
                          ...files,
                          image: e.target.files?.[0] || null,
                        });
                      }}
                    />
                  </div>

                  {files.image && (
                    <div className="mb-3 text-center">
                      <img
                        ref={imageRef}
                        src={URL.createObjectURL(files.image)}
                        alt="Preview"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSongDialogOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
