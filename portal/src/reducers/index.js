import { combineReducers } from 'redux';
import playState from './playState';
import common from './common';
import stuffle from './stuffle';
import songs from './songs';

const reducers = combineReducers({
  common,
  playState,
  stuffle,
  songs,
});

export default reducers;
