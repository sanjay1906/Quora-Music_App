import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Avatar, Chip, Grid, CircularProgress } from '@material-ui/core';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import SkipNext from '@material-ui/icons/SkipNext';
import { repeatType, togglePlaying, isOpen } from '../actions';
import SongCard from './SongCard';
import SongList from './SongList';

const mapStateToProps = (state) => ({
  playState: state.playState,
  repeatType: state.common.repeat,
  localMode: state.stuffle.localMode,
});

const mapDispatchToProps = (dispatch) => ({
  togglePlaying: () => dispatch(togglePlaying()),
  setOpen: (is) => dispatch(isOpen(is)),
});

class PlayingCtrl extends Component {
  componentDidMount() {
    const { installEvent } = this.props;
    setTimeout(
      () => typeof installEvent === 'function' && installEvent(),
      3000
    );
  }

  render() {
    const {
      setOpen,
      playState,
      songs,
      playNext,
      playPrevious,
      time,
      duration,
      currentTime,
      togglePlaying: toggle,
      timeDrag,
    } = this.props;

    const song = JSON.parse(localStorage.getItem('playedSong'));

    return (
      <div>
        <SongList songs={songs} />
        {song && (
          <div>
            <SongCard
              song={song}
              playNext={playNext}
              timeDrag={timeDrag}
              time={time}
              duration={duration}
              repeatType={repeatType}
              currentTime={currentTime}
              playPrevious={playPrevious}
            />

            <Grid
              className="stay-control"
              style={{
                border: '1px solid #673ab7',
                borderRadius: '30px 30px  30px 30px',
                background: 'white',
              }}
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              item
              xs={12}
            >
              <Chip
                style={{
                  height: 40,
                  width: 200,
                  justifyContent: 'start',
                  border: 'none',
                }}
                avatar={
                  <Avatar
                    style={{ height: 43, width: 43 }}
                    alt={song.title}
                    src={song.musicImage}
                  />
                }
                label={song.title}
                onClick={() => setOpen(true)}
                variant="outlined"
              />
              <IconButton onClick={playPrevious}>
                <SkipPrevious />
              </IconButton>
              {currentTime ? (
                <IconButton onClick={toggle}>
                  {playState.playing ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              ) : (
                <CircularProgress size={18} color="secondary" />
              )}
              <IconButton onClick={playNext}>
                <SkipNext />
              </IconButton>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

PlayingCtrl.defaultProps = {
  installEvent: null,
};

PlayingCtrl.propTypes = {
  timeDrag: propTypes.func.isRequired,
  playNext: propTypes.func.isRequired,
  playPrevious: propTypes.func.isRequired,
  repeatType: propTypes.number.isRequired,
  currentTime: propTypes.number.isRequired,
  togglePlaying: propTypes.func.isRequired,
  playState: propTypes.objectOf(propTypes.any).isRequired,
  installEvent: propTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayingCtrl);
