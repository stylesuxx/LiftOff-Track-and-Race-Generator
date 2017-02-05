import { ENABLE_DOWNLOAD } from './const';

function action(parameter) {
  return { type: ENABLE_DOWNLOAD, parameter };
}

module.exports = action;
