import { REPEAT } from '../actions/index';

const initialState = {
  repeat: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REPEAT: {
      return { ...state, repeat: action.id };
    }

    default: {
      return state;
    }
  }
};
