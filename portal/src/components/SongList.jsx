import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { playSong } from '../actions';
import Song from './Song';

const SongList = ({ songs, play }) => {
  const handleSongClick = (ind) => () => play(ind);

  if (!songs.length) {
    return (
      <h4 style={{ fontWeight: 300, textAlign: 'center' }}>
        No Songs Present. Please Add Songs
      </h4>
    );
  }
  return (
    <div>
      <List>
        {songs.map((song, ind) => [
          <Song
            key={`song-${song.lastModifiedDate}`}
            handleClick={handleSongClick(ind)}
            song={song}
          />,
          <Divider key={`divider-${song.lastModifiedDate}`} />,
        ])}
      </List>
    </div>
  );
};

SongList.propTypes = {
  play: PropTypes.func.isRequired,
  songs: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default connect(null, { play: playSong })(SongList);
