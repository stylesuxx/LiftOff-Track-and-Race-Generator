import { SET_MARKER_SPACING } from './const';

function action(parameter) {
  return { type: SET_MARKER_SPACING, parameter };
}

module.exports = action;
