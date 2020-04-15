import { STUFFLE, ISOPEN, VOLUME, MANAGER } from '../actions/index';

const initialState = {
  stuffle: false,
  isOpen: false,
  isVolume: 100,
  manager: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case STUFFLE: {
      return { ...state, stuffle: action.st };
    }
    case ISOPEN: {
      return { ...state, isOpen: action.is };
    }
    case VOLUME: {
      return { ...state, isVolume: action.volume };
    }
    case MANAGER: {
      return { ...state, manager: action.m };
    }
    default: {
      return state;
    }
  }
};
