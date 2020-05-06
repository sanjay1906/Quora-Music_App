import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';
import {
  repeatType,
  togglePlaying,
  isOpen,
  volumeUpDown,
  stufflePlaying,
} from '../actions';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import {
  Slider,
  Container,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import PauseIcon from '@material-ui/icons/PauseCircleFilled';
import SkipNext from '@material-ui/icons/SkipNext';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Repeat from '@material-ui/icons/Repeat';
import RepeatOne from '@material-ui/icons/RepeatOne';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import VolumeUp from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const mapStateToProps = (state) => ({
  playState: state.playState,
  repeatType: state.common.repeat,
  stuffle: state.stuffle.stuffle,
  isOpen: state.stuffle.isOpen,
  isVolume: state.stuffle.isVolume,
});

const mapDispatchToProps = (dispatch) => ({
  changeRepeat: (id) => dispatch(repeatType(id)),
  togglePlaying: () => dispatch(togglePlaying()),
  stufflePlaying: (st) => dispatch(stufflePlaying(st)),
  setOpen: (is) => dispatch(isOpen(is)),
  volumeUpDown: (volume) => dispatch(volumeUpDown(volume)),
});

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="left" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

function FullScreenDialog(props) {
  const classes = useStyles();
  const [volume, setvolume] = useState(false);
  const {
    isOpen,
    setOpen,
    playState,
    song,
    playNext,
    playPrevious,
    time,
    duration,
    currentTime,
    repeatType: repeat,
    togglePlaying: toggle,
    timeDrag,
    stuffle,
    volumeUpDown,
    isVolume,
  } = props;

  const changeRepeat = () => {
    const { repeatType: repeat, changeRepeat } = props;
    const nextRepeat = repeat === 2 ? 0 : repeat + 1;
    changeRepeat(nextRepeat);
  };

  const stufflePlaying = () => {
    const { stuffle, stufflePlaying } = props;
    const liveStuffle = stuffle === true ? false : true;
    stufflePlaying(liveStuffle);
  };

  const formatDuration = (duration) => {
    return moment
      .duration(duration, 'seconds')
      .format('mm:ss', { trim: false });
  };

  const volumeSet = () => {
    const liveVolume = volume === true ? false : true;
    setvolume(liveVolume);
  };

  const songCard = () => {
    console.log(momentDurationFormatSetup);
    setOpen(false);
    setvolume(false);
  };

  const handleSliderChange = () => {
    setTimeout(() => {
      setvolume(false);
    }, 3000);
  };

  return (
    <div>
      <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              onClick={songCard}
              edge="start"
              color="inherit"
              aria-label="close"
            >
              <KeyboardArrowRightIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {song.title}
            </Typography>
            <IconButton onClick={volumeSet} color="inherit" aria-label="close">
              <VolumeUp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div onClick={() => setvolume(false)}>
          <Container
            maxWidth="md"
            fixed
            style={{
              textAlign: 'center',
              marginTop: 25,
            }}
          >
            {volume && (
              <div className="volume-control">
                <Slider
                  onChange={(e, newvalue) => volumeUpDown(newvalue)}
                  ValueLabelComponent={ValueLabelComponent}
                  orientation="vertical"
                  value={isVolume}
                  aria-labelledby="vertical-slider"
                  onChangeCommitted={handleSliderChange}
                />
              </div>
            )}

            <img
              alt={song.title}
              src={song.musicImage}
              style={{
                backgroundColor: '#cfe8fc',
                width: '42.5vh',
                height: '43vh',
                borderRadius: '20%',
              }}
            />
            <Typography style={{ marginTop: 20 }} variant="h6" gutterBottom>
              {song.title}
            </Typography>
            <Typography className="marquee" variant="h6" gutterBottom>
              <p>{song.artist}</p>
            </Typography>
          </Container>
          <Paper className="play-control">
            <Slider
              disabled={currentTime ? false : true}
              value={currentTime}
              onChange={(_, newVal) => timeDrag(newVal)}
              max={100}
              marks={[
                { value: 5, label: formatDuration(time) },
                { value: 95, label: formatDuration(duration) },
              ]}
              min={0}
              defaultValue={2}
            />
            <div className="now-playing-container">
              <div
                style={{ width: '35%', textAlign: 'center' }}
                className="side-icons"
              >
                <IconButton onClick={changeRepeat}>
                  {repeat === 1 ? (
                    <RepeatOne />
                  ) : (
                    <Repeat style={repeat === 2 ? {} : { opacity: 0.5 }} />
                  )}
                </IconButton>
                <IconButton onClick={playPrevious}>
                  <SkipPrevious />
                </IconButton>
              </div>
              <div
                style={{ width: '30%', textAlign: 'center' }}
                className="play-pause-button"
              >
                <IconButton onClick={toggle}>
                  {currentTime ? (
                    <div>
                      {playState.playing ? <PauseIcon /> : <PlayIcon />}
                    </div>
                  ) : (
                    <CircularProgress size={18} color="secondary" />
                  )}
                </IconButton>
              </div>
              <div
                style={{ width: '35%', textAlign: 'center' }}
                className="side-icons"
              >
                <IconButton onClick={playNext}>
                  <SkipNext />
                </IconButton>
                <IconButton onClick={stufflePlaying}>
                  {stuffle ? (
                    <ShuffleIcon className="material-icons" />
                  ) : (
                    <ShuffleIcon
                      style={{ opacity: 0.5 }}
                      className="material-icons"
                    />
                  )}
                </IconButton>
              </div>
            </div>
          </Paper>
        </div>
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenDialog);
