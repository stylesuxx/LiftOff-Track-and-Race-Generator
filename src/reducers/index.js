/* eslint-disable import/newline-after-import */
/* Combine all available reducers to a single root reducer.
 *
 * CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
/* Populated by react-webpack-redux:reducer */
import { combineReducers } from 'redux';
import liftoff from '../reducers/liftoff.js';
import xml from '../reducers/xml.js';
import canvas from '../reducers/canvas.js';
import track from '../reducers/track.js';
const reducers = {
  track,
  canvas,
  xml,
  liftoff
};
const combined = combineReducers(reducers);
module.exports = combined;
