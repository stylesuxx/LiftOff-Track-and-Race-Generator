import { TOGGLE_GRID_SNAP } from './const';

function action(parameter) {
  return { type: TOGGLE_GRID_SNAP, parameter };
}

module.exports = action;
