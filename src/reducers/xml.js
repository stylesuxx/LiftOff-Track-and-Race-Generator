/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  SET_TRACK_TEXT,
  SET_RACE_TEXT,
  ENABLE_DOWNLOAD,
} from '../actions/const';

const initialState = {
  download: false,
  track: {
    id: 'Track Id',
    value: '--- Hit preview to render Track XML ---'
  },
  race: {
    id: 'Race Id',
    value: '--- Gates need to be enabled ---'
  }
};

function reducer(state = initialState, action) {
  const nextState = Object.assign({}, state);

  switch (action.type) {
    case SET_TRACK_TEXT: {
      nextState.track.id = action.parameter.id;
      nextState.track.value = action.parameter.value;

      return nextState;
    }

    case SET_RACE_TEXT: {
      nextState.race.id = action.parameter.id;
      nextState.race.value = action.parameter.value;

      return nextState;
    }

    case ENABLE_DOWNLOAD: {
      nextState.download = true;
      return nextState;
    }

    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

module.exports = reducer;
