/* CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  toggleDoubleLine,
  setMarkerSpacing,
  startAddingPoint,
  stopAddingPoint,
  setGateSpacing,
  toggleGridSnap,
  enableDownload,
  renderPreview,
  setTrackWidth,
  setMarkerType,
  toggleClosed,
  setTrackText,
  toggleGates,
  deletePoint,
  setRaceText,
  closeTrack,
  openTrack,
  setName,
  setMap
} from '../actions/';
import Main from '../components/App';
/* Populated by react-webpack-redux:reducer */
class App extends Component {
  render() {
    const {actions, track, canvas, xml} = this.props;
    return (
      <Main
        actions={actions}
        track={track}
        canvas={canvas}
        xml={xml}/>
    );
  }
}
/* Populated by react-webpack-redux:reducer
 *
 * HINT: if you adjust the initial type of your reducer, you will also have to
 *       adjust it here.
 */
App.propTypes = {
  actions: PropTypes.shape({
    toggleDoubleLine: PropTypes.func.isRequired,
    setMarkerSpacing: PropTypes.func.isRequired,
    startAddingPoint: PropTypes.func.isRequired,
    stopAddingPoint: PropTypes.func.isRequired,
    setGateSpacing: PropTypes.func.isRequired,
    toggleGridSnap: PropTypes.func.isRequired,
    enableDownload: PropTypes.func.isRequired,
    renderPreview: PropTypes.func.isRequired,
    setTrackWidth: PropTypes.func.isRequired,
    setMarkerType: PropTypes.func.isRequired,
    setTrackText: PropTypes.func.isRequired,
    toggleGates: PropTypes.func.isRequired,
    deletePoint: PropTypes.func.isRequired,
    setRaceText: PropTypes.func.isRequired,
    closeTrack: PropTypes.func.isRequired,
    openTrack: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    setMap: PropTypes.func.isRequired
  }),
  track: PropTypes.shape({
    trackWidth: React.PropTypes.number.isRequired,
    markerSpacing: PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    gateSpacing: PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    gatesEnabled: PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
    doubleLine: PropTypes.bool.isRequired,
    closed: PropTypes.bool.isRequired
  }),
  canvas: PropTypes.shape({
    trackRendered: React.PropTypes.bool.isRequired,
    nodeDeleted: React.PropTypes.bool.isRequired,
    gridSnap: React.PropTypes.bool.isRequired,
    addingNode: PropTypes.bool.isRequired
  }),
  xml: React.PropTypes.shape({
    download: React.PropTypes.bool.isRequired,
    track: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
    }).isRequired,
    race: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
function mapStateToProps(state) {
  /* Populated by react-webpack-redux:reducer */
  const props = {
    canvas: state.canvas,
    track: state.track,
    xml: state.xml
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  /* Populated by react-webpack-redux:action */
  const actions = {
    toggleDoubleLine,
    setMarkerSpacing,
    startAddingPoint,
    stopAddingPoint,
    setGateSpacing,
    toggleGridSnap,
    enableDownload,
    renderPreview,
    setTrackWidth,
    setMarkerType,
    toggleClosed,
    setTrackText,
    toggleGates,
    deletePoint,
    setRaceText,
    closeTrack,
    openTrack,
    setName,
    setMap
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
