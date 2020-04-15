let mongoose = require('mongoose');
let musicSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  music: {
    type: String,
    required: true
  },
  musicImage: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});
let Music = mongoose.model('Music', musicSchema);
module.exports = Music;
