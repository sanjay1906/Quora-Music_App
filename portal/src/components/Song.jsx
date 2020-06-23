import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  localMode: state.stuffle.localMode,
});

const Song = (props) => {
  const { song, handleClick, localMode, handleIconClick } = props;

  return (
    <ListItem onClick={handleClick}>
      <ListItemAvatar>
        <Avatar
          alt={localMode ? song.name : song.title}
          src={localMode ? song.name : song.musicImage}
        />
      </ListItemAvatar>
      <ListItemText
        className="sortText"
        primary={localMode ? song.name : song.title}
        secondary={localMode ? 'unknown' : song.artist}
      />
      {localMode && (
        <ListItemSecondaryAction onClick={handleIconClick}>
          <IconButton aria-label="Delete">
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

Song.propTypes = {
  song: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
};
export default connect(mapStateToProps)(Song);
