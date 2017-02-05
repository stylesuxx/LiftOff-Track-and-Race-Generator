import { SET_MARKER_TYPE } from './const';

function action(parameter) {
  return { type: SET_MARKER_TYPE, parameter };
}

module.exports = action;
