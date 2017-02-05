import { OPEN_TRACK } from './const';

function action(parameter) {
  return { type: OPEN_TRACK, parameter };
}

module.exports = action;
