import { STOP_ADDING_POINT } from './const';

function action(parameter) {
  return { type: STOP_ADDING_POINT, parameter };
}

module.exports = action;
