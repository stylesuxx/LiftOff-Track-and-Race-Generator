/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  START_ADDING_POINT,
  STOP_ADDING_POINT,
  DELETE_POINT,
  TOGGLE_GRID_SNAP
} from '../actions/const';

const initialState = {
  nodeAdded: true,
  nodeDeleted: true,
  gridSnap: false
};

function reducer(state = initialState, action) {
  const nextState = Object.assign({}, state);

  switch (action.type) {

    case START_ADDING_POINT: {
      nextState.nodeAdded = false;

      return nextState;
    }

    case STOP_ADDING_POINT: {
      nextState.nodeAdded = true;

      return nextState;
    }

    case DELETE_POINT: {
      nextState.nodeDeleted = !nextState.nodeDeleted;

      return nextState;
    }

    case TOGGLE_GRID_SNAP: {
      nextState.gridSnap = !nextState.gridSnap;

      return nextState;
    }

    default: {
      return state;
    }
  }
}

module.exports = reducer;
