import { TOGGLE_GATES } from './const';

function action(parameter) {
  return { type: TOGGLE_GATES, parameter };
}

module.exports = action;
