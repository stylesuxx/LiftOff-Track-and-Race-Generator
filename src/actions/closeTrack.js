import { CLOSE_TRACK } from './const';

function action(parameter) {
  return { type: CLOSE_TRACK, parameter };
}

module.exports = action;
