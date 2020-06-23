// import mediaSession from '../utils/media-session';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const PLAY_SONG = 'PLAY_SONG';
export const REPEAT = 'REPEAT';
export const STUFFLE = 'STUFFLE';
export const ISOPEN = 'ISOPEN';
export const VOLUME = 'VOLUME';
export const MANAGER = 'MANAGER';
export const ADD_SONGS = 'ADD_SONGS';
export const REMOVE_SONGS = 'REMOVE_SONGS';
export const LOCALMODE = 'LOCALMODE';

export const playSong = (id) => {
  return {
    type: PLAY_SONG,
    id,
  };
};
export const repeatType = (id) => ({
  type: REPEAT,
  id,
});
export const togglePlaying = () => ({
  type: TOGGLE_PLAYING,
});

export const stufflePlaying = (st) => ({
  type: STUFFLE,
  st,
});
export const isOpen = (is) => ({
  type: ISOPEN,
  is,
});
export const volumeUpDown = (volume) => ({
  type: VOLUME,
  volume,
});

export const managerOpen = (m) => ({
  type: MANAGER,
  m,
});

export const addSongs = (songs) => ({
  type: ADD_SONGS,
  songs,
});

export const removeSong = (id) => ({
  type: REMOVE_SONGS,
  id,
});

export const localMode = (l) => ({
  type: LOCALMODE,
  l,
});
