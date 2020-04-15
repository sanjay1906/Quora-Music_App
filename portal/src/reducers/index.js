import { combineReducers } from 'redux';
import playState from './playState';
import common from './common';
import stuffle from './stuffle';

const reducers = combineReducers({
  common,
  playState,
  stuffle,
});

export default reducers;
