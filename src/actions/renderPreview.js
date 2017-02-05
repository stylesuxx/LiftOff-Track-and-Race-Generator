import { RENDER_PREVIEW } from './const';

function action(parameter) {
  return { type: RENDER_PREVIEW, parameter };
}

module.exports = action;
