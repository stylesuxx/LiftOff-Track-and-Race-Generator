import { SET_MAP } from './const';

function action(parameter) {
  return { type: SET_MAP, parameter };
}

module.exports = action;
