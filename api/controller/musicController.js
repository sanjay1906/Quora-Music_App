const Musicdata = require('../model/Music');

// get all music
const getAllMusics = async (req, res) => {
  try {
    let music = await Musicdata.find();
    res.status(200).json(music);
  } catch (err) {
    res.status(500).json(err);
  }
};

// addnew music
const addNewMusic = async (req, res) => {
  const { title, music, musicImage, artist, time } = req.body;
  try {
    const newmusic = await new Musicdata({
      title,
      music,
      musicImage,
      artist,
      time
    }).save();
    res.status(200).json({ newmusic, msg: 'music added' });
  } catch (error) {
    res.status(500).json(error);
  }
};

// deletemusic
const deleteMusic = async (req, res) => {
  try {
    const id = req.params.musicId;
    let result = await Musicdata.remove({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAllMusics,
  addNewMusic,
  deleteMusic
};
