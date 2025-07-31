import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/Spinner";

export default function AddAlbumDialog() {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImgFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("albumImg", imgFile!);
      await axiosInstance.post("/albums/admin/albums", formData);
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
      });
      setImgFile(null);
      setAlbumDialogOpen(false);
      toast.success("Album added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add album.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setAlbumDialogOpen(true)}
      >
        Add Album
      </button>

      {albumDialogOpen && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          onClick={() => setAlbumDialogOpen(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            {isSubmitting && (
              <LoadingSpinner
                centered
                fullscreen
                text="Adding Album"
                size="lg"
              />
            )}
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Add New Album</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAlbumDialogOpen(false)}
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
                      value={newAlbum.title}
                      onChange={(e) =>
                        setNewAlbum({ ...newAlbum, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Artist</label>
                    <input
                      type="text"
                      className="form-control"
                      name="artist"
                      value={newAlbum.artist}
                      onChange={(e) =>
                        setNewAlbum({ ...newAlbum, artist: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image File</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setAlbumDialogOpen(false)}
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
