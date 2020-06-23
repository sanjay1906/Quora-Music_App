import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { playSong } from './actions';
import axios from 'axios';
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
  localSongs: state.songs,
  localMode: state.stuffle.localMode,
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
    const { localSongs } = this.props;
    const local = JSON.parse(localStorage.getItem('local'));
    if (local) {
      const songs = localSongs.map(function (val) {
        return {
          title: val.name,
          music: URL.createObjectURL(val),
          musicImage: val.name,
          artist: 'unknown',
        };
      });
      localStorage.setItem('songs', JSON.stringify(songs));
    } else {
      axios.get(`music`).then((res) => {
        const songs = res.data;
        this.setState({ songs });
        localStorage.setItem('songs', JSON.stringify(songs));
      });
    }
  };

  componentDidMount() {
    localStorage.removeItem('local');
    localStorage.removeItem('playedSong');
    this.getData();
    const { songs } = this.state;
    if (songs) {
      this.audioPlayer.src = songs[0].music;
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
    const songs = JSON.parse(localStorage.getItem('songs'));
    const { playState, playSong: play } = this.props;
    const nextSongId = (playState.songId + 1) % songs.length;
    play(nextSongId);
  };

  songEnded = () => {
    const songs = JSON.parse(localStorage.getItem('songs'));
    const { stuffle, playState, repeatType, playSong: play } = this.props;
    if (repeatType === 1) {
      // repeat one
      play(playState.songId);
    } else if (stuffle === true) {
      // stuffle play
      let randomIndex = Math.round(Math.random() * songs.length);
      const liveStuffle = randomIndex === songs.length ? 0 : randomIndex;
      play(liveStuffle);
    } else if (repeatType === 0) {
      // play all song one time
      if (playState.songId < songs.length - 1) play(playState.songId + 1);
    } else {
      // repeat all
      this.playNext();
    }
  };

  playPrevious = () => {
    const songs = JSON.parse(localStorage.getItem('songs'));
    const { playState, playSong: play } = this.props;

    const prevSongId =
      playState.songId === 0 ? songs.length - 1 : playState.songId - 1;
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
    const thesong = JSON.parse(localStorage.getItem('songs'));
    if (thesong) {
      this.audioPlayer.src = thesong[id].music;
      this.audioPlayer.play();
      window.document.title = thesong[id].title;
      localStorage.setItem('playedSong', JSON.stringify(thesong[id]));
    }
  };

  timeDrag = (time) => {
    this.audioPlayer.currentTime = this.audioPlayer.duration * (time / 100);
  };

  render() {
    const {
      songs,
      currentTime,
      time,
      duration,
      installEvent,
      severity,
      isOpen,
      snackMessage,
    } = this.state;
    const {
      repeatType,
      playState,
      manager,
      localMode,
      localSongs,
    } = this.props;
    if (!songs) {
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
        <Navbar updateData={this.getData} />
        <Snackbar
          snackMessage={snackMessage}
          snackClose={() => this.setState({ isOpen: false })}
          isOpen={isOpen}
          severity={severity}
        />
        {manager ? (
          <Addsong updateData={this.getData} songs={songs} />
        ) : (
          <PlayingCtrl
            installEvent={installEvent}
            songs={localMode ? localSongs : songs}
            song={
              localMode ? localSongs[playState.songId] : songs[playState.songId]
            }
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
