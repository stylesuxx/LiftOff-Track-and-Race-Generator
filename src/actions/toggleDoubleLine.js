import { TOGGLE_DOUBLE_LINE } from './const';

function action(parameter) {
  return { type: TOGGLE_DOUBLE_LINE, parameter };
}

module.exports = action;
