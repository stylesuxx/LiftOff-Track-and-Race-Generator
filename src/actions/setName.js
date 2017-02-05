import { SET_NAME } from './const';

function action(parameter) {
  return { type: SET_NAME, parameter };
}

module.exports = action;
