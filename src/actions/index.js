/* eslint-disable import/newline-after-import */
/* Exports all the actions from a single point.

Allows to import actions like so:

import {action1, action2} from '../actions/'
*/
/* Populated by react-webpack-redux:action */
import setMarkerType from '../actions/setMarkerType.js';
import enableDownload from '../actions/enableDownload.js';
import setRaceText from '../actions/setRaceText.js';
import setName from '../actions/setName.js';
import setTrackText from '../actions/setTrackText.js';
import setTrackWidth from '../actions/setTrackWidth.js';
import renderPreview from '../actions/renderPreview.js';
import toggleGridSnap from '../actions/toggleGridSnap.js';
import deletePoint from '../actions/deletePoint.js';
import openTrack from '../actions/openTrack.js';
import closeTrack from '../actions/closeTrack.js';
import stopAddingPoint from '../actions/stopAddingPoint.js';
import startAddingPoint from '../actions/startAddingPoint.js';
import setMap from '../actions/setMap.js';
import setGateSpacing from '../actions/setGateSpacing.js';
import setMarkerSpacing from '../actions/setMarkerSpacing.js';
import toggleDoubleLine from '../actions/toggleDoubleLine.js';
import toggleGates from '../actions/toggleGates.js';
const actions = {
  toggleGates,
  toggleDoubleLine,
  setMarkerSpacing,
  setGateSpacing,
  setMap,
  startAddingPoint,
  stopAddingPoint,
  closeTrack,
  openTrack,
  deletePoint,
  toggleGridSnap,
  renderPreview,
  setTrackWidth,
  setTrackText,
  setName,
  setRaceText,
  enableDownload,
  setMarkerType
};
module.exports = actions;
