import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const Song = ({ song, handleClick }) => (
  <ListItem onClick={handleClick}>
    <ListItemAvatar>
      <Avatar alt={song.title} src={song.musicImage} />
    </ListItemAvatar>
    <ListItemText primary={song.title} secondary={song.artist} />
  </ListItem>
);

Song.propTypes = {
  song: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
};
export default Song;
