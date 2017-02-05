import { SET_TRACK_WIDTH } from './const';

function action(parameter) {
  return { type: SET_TRACK_WIDTH, parameter };
}

module.exports = action;
