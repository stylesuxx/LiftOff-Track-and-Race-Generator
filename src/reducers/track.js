/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  TOGGLE_DOUBLE_LINE,
  SET_MARKER_SPACING,
  START_ADDING_POINT,
  STOP_ADDING_POINT,
  SET_GATE_SPACING,
  SET_MARKER_TYPE,
  SET_TRACK_WIDTH,
  TOGGLE_GATES,
  CLOSE_TRACK,
  OPEN_TRACK,
  SET_NAME,
  SET_MAP
} from '../actions/const';

const initialState = {
  markerType: 'DiscConeBlue01',
  name: 'Trackname 01',
  map: 'LiftoffArena',
  gatesEnabled: false,
  doubleLine: false,
  markerSpacing: 20,
  gateSpacing: 100,
  trackWidth: 17.5,
  closed: false,
  height: 1000,
  width: 600,

  addingNode: false,
};

function reducer(state = initialState, action) {
  const nextState = Object.assign({}, state);

  switch (action.type) {
    case TOGGLE_GATES: {
      nextState.gatesEnabled = !nextState.gatesEnabled;
      return nextState;
    }

    case TOGGLE_DOUBLE_LINE: {
      nextState.doubleLine = !nextState.doubleLine;
      return nextState;
    }

    case SET_MARKER_SPACING: {
      nextState.markerSpacing = parseInt(action.parameter, 10);
      return nextState;
    }

    case SET_GATE_SPACING: {
      nextState.gateSpacing = parseInt(action.parameter, 10);
      return nextState;
    }

    case CLOSE_TRACK: {
      nextState.closed = true;
      return nextState;
    }

    case OPEN_TRACK: {
      nextState.closed = false;
      return nextState;
    }

    case SET_MAP: {
      nextState.map = action.parameter;
      return nextState;
    }

    case START_ADDING_POINT: {
      nextState.addingNode = true;
      return nextState;
    }

    case STOP_ADDING_POINT: {
      nextState.addingNode = false;
      return nextState;
    }

    case SET_TRACK_WIDTH: {
      nextState.trackWidth = parseFloat(action.parameter, 10);
      return nextState;
    }

    case SET_NAME: {
      nextState.name = action.parameter;
      return nextState;
    }

    case SET_MARKER_TYPE: {
      nextState.markerType = action.parameter;
      return nextState;
    }

    default: {
      return state;
    }
  }
}

module.exports = reducer;
