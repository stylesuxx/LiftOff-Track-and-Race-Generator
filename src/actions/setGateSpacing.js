import { SET_GATE_SPACING } from './const';

function action(parameter) {
  return { type: SET_GATE_SPACING, parameter };
}

module.exports = action;
