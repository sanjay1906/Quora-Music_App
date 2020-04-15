import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { playSong } from './actions';
import AxiosApi from './config/axios';
import Navbar from './components/Navbar';
import PlayingCtrl from './components/PlayingCtrl';
import Addsong from './components/Addsong';
import Snackbar from './components/Snackbar';
import { LinearProgress } from '@material-ui/core';

const mapStateToProps = (state) => ({
  playState: state.playState,
  repeatType: state.common.repeat,
  stuffle: state.stuffle.stuffle,
  isVolume: state.stuffle.isVolume,
  manager: state.stuffle.manager,
});

const mapDispatchToProps = (dispatch) => ({
  playSong: (id) => dispatch(playSong(id)),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      duration: 0,
      currentTime: 0,
      hasRejectedInstall: false,
      installEvent: null,
      isOpen: false,
      severity: '',
      snackMessage: '',
    };
  }

  getData = () => {
    AxiosApi.get(`music`).then((res) => {
      const persons = res.data;
      this.setState({ persons });
    });
  };

  componentDidMount() {
    this.getData();
    const { persons } = this.state;
    if (persons) {
      this.audioPlayer.src = persons[0].music;
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setState({ installEvent: e });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { playState } = this.props;
    const { installEvent, hasRejectedInstall } = this.state;
    if (nextProps.playState !== playState) {
      if (!nextProps.playState.playing) {
        // PAUSE
        this.audioPlayer.pause();
      } else if (nextProps.playState.songId === -1) {
        this.playSong(0);
      } else if (nextProps.playState.songId === playState.songId) {
        // RESUME
        this.audioPlayer.play();
        // Start playing
      } else {
        this.playSong(nextProps.playState.songId);
      }
      if (installEvent && !hasRejectedInstall) {
        installEvent.prompt();
        installEvent.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.setState({
              isOpen: true,
              severity: 'success',
              hasRejectedInstall: false,
              snackMessage: "🤗 Yay! You've installed the app",
            });
          } else {
            this.setState({
              isOpen: true,
              severity: 'info',
              hasRejectedInstall: true,
              snackMessage: '😥 whenever you change your mind',
            });
          }
          this.isOpen({ installEvent: null });
        });
      }
    }
  }

  playNext = () => {
    const { persons } = this.state;
    const { playState, playSong: play } = this.props;
    URL.revokeObjectURL(persons[playState.songId]);
    const nextSongId = (playState.songId + 1) % persons.length;
    play(nextSongId);
  };

  songEnded = () => {
    const { persons } = this.state;
    const { stuffle, playState, repeatType, playSong: play } = this.props;
    if (repeatType === 1) {
      // repeat one
      play(playState.songId);
    } else if (stuffle === true) {
      // stuffle play
      let randomIndex = Math.round(Math.random() * persons.length);
      const liveStuffle = randomIndex === persons.length ? 0 : randomIndex;
      play(liveStuffle);
    } else if (repeatType === 0) {
      // play all song one time
      URL.revokeObjectURL(persons[playState.songId]);
      if (playState.songId < persons.length - 1) play(playState.songId + 1);
    } else {
      // repeat all
      this.playNext();
    }
  };

  playPrevious = () => {
    const { persons } = this.state;
    const { playState, playSong: play } = this.props;
    URL.revokeObjectURL(persons[playState.songId]);
    const prevSongId =
      playState.songId === 0 ? persons.length - 1 : playState.songId - 1;
    play(prevSongId);
  };

  updateTime = () => {
    const { isVolume } = this.props;
    this.audioPlayer.volume = isVolume / 100;
    const time = this.audioPlayer.currentTime;
    const duration = this.audioPlayer.duration;
    const currentTime =
      (100 * this.audioPlayer.currentTime) / this.audioPlayer.duration || 0;
    this.setState({ time });
    this.setState({ duration });
    this.setState({ currentTime });
  };

  playSong = (id) => {
    const { persons } = this.state;
    if (persons[id]) {
      this.audioPlayer.src = persons[id].music;
      this.audioPlayer.play();
      window.document.title = persons[id].title;
    }
  };

  timeDrag = (time) => {
    this.audioPlayer.currentTime = this.audioPlayer.duration * (time / 100);
  };

  render() {
    const {
      persons,
      currentTime,
      time,
      duration,
      installEvent,
      severity,
      isOpen,
      snackMessage,
    } = this.state;
    const { repeatType, playState, manager } = this.props;
    if (!persons) {
      return (
        <div
          style={{
            position: 'fixed',
            top: '50vh',
            width: '100%',
            '& > * + *': {},
          }}
        >
          <LinearProgress variant="query" color="secondary" />
          <LinearProgress variant="indeterminate" />
          <LinearProgress variant="indeterminate" color="secondary" />
          <LinearProgress variant="query" />
        </div>
      );
    }
    return (
      <>
        <audio
          hidden
          controls
          onEnded={this.songEnded}
          onTimeUpdate={this.updateTime}
          ref={(audio) => {
            this.audioPlayer = audio;
          }}
        >
          <track kind="captions" {...{}} />
        </audio>
        <Navbar />
        <Snackbar
          snackMessage={snackMessage}
          snackClose={() => this.setState({ isOpen: false })}
          isOpen={isOpen}
          severity={severity}
        />
        {manager ? (
          <Addsong updateData={this.getData} songs={persons} />
        ) : (
          <PlayingCtrl
            installEvent={installEvent}
            songs={persons}
            song={persons[playState.songId]}
            playNext={this.playNext}
            timeDrag={this.timeDrag}
            time={time}
            duration={duration}
            repeatType={repeatType}
            currentTime={currentTime}
            playPrevious={this.playPrevious}
          />
        )}
      </>
    );
  }
}

App.propTypes = {
  playState: PropTypes.shape({
    playing: PropTypes.bool.isRequired,
    songId: PropTypes.number.isRequired,
  }).isRequired,
  repeatType: PropTypes.oneOf([0, 1, 2]).isRequired,
  playSong: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
