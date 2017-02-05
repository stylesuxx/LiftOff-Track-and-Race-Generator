/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  START_ADDING_POINT,
  STOP_ADDING_POINT,
  TOGGLE_GRID_SNAP,
  RENDER_PREVIEW,
  DELETE_POINT
} from '../actions/const';

const initialState = {
  trackRendered: true,
  nodeDeleted: true,
  addingNode: false,
  gridSnap: false
};

function reducer(state = initialState, action) {
  const nextState = Object.assign({}, state);

  switch (action.type) {

    case DELETE_POINT: {
      nextState.nodeDeleted = !nextState.nodeDeleted;

      return nextState;
    }

    case TOGGLE_GRID_SNAP: {
      nextState.gridSnap = !nextState.gridSnap;

      return nextState;
    }

    case RENDER_PREVIEW: {
      nextState.trackRendered = !nextState.trackRendered;
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

    default: {
      return state;
    }
  }
}

module.exports = reducer;
