import Artist from "../models/artist.model.js";

const getAllArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find();
    res.status(201).json({ artists });
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(201).json(artist);
  } catch (error) {
    next(error);
  }
};

export { getAllArtists, getArtistById };
