import { SET_TRACK_TEXT } from './const';

function action(parameter) {
  return { type: SET_TRACK_TEXT, parameter };
}

module.exports = action;
