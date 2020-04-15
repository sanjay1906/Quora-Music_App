// import mediaSession from '../utils/media-session';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const PLAY_SONG = 'PLAY_SONG';
export const REPEAT = 'REPEAT';
export const STUFFLE = 'STUFFLE';
export const ISOPEN = 'ISOPEN';
export const VOLUME = 'VOLUME';
export const MANAGER = 'MANAGER';

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
