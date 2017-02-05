import { SET_RACE_TEXT } from './const';

function action(parameter) {
  return { type: SET_RACE_TEXT, parameter };
}

module.exports = action;
