import { DELETE_POINT } from './const';

function action(parameter) {
  return { type: DELETE_POINT, parameter };
}

module.exports = action;
