import { START_ADDING_POINT } from './const';

function action(parameter) {
  return { type: START_ADDING_POINT, parameter };
}

module.exports = action;
