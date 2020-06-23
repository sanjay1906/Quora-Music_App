import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import { playSong, removeSong } from '../actions';
import Song from './Song';

const mapStateToProps = (state) => ({
  localMode: state.stuffle.localMode,
});

const mapDispatchToProps = (dispatch) => ({
  playSong: (s) => dispatch(playSong(s)),
  removeSong: (r) => dispatch(removeSong(r)),
});

const SongList = (props) => {
  const { songs, playSong, localMode, removeSong } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const [activeSong, setActiveSong] = useState(-1);

  const setActiveSongItem = (ind) => ({ target }) => {
    setAnchorEl(target);
    setActiveSong(ind);
  };

  if (!songs.length) {
    return (
      <h4
        style={{
          position: 'fixed',
          top: '300px',
          left: '45px',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {localMode
          ? 'No Songs Present. Please Add Songs'
          : 'No Songs Here... Admin can Add Only'}
      </h4>
    );
  }
  return (
    <div style={{ marginBottom: '55px', marginTop: '55px' }}>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => removeSong(activeSong)}>Remove Song</MenuItem>
      </Menu>
      <List>
        {songs.map((song, ind) => [
          <Song
            key={`song-${song.lastModifiedDate}`}
            handleClick={() => playSong(ind)}
            handleIconClick={setActiveSongItem(ind)}
            song={song}
          />,
          <Divider key={`divider-${song.lastModifiedDate}`} />,
        ])}
      </List>
    </div>
  );
};

SongList.propTypes = {
  playSong: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SongList);
