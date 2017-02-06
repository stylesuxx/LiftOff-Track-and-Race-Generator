import React from 'react';
import Open from './Open';
import Closed from './Closed';

class TrackSettings extends React.Component {

  render() {
    const closed = this.props.track.closed;

    if (closed) {
      return (
        <Closed
          className="tracksettings-component"
          track={this.props.track}
          actions={this.props.actions}
          xml={this.props.xml}
          liftoff={this.props.liftoff} />
      );
    }

    return (
      <Open
        className="tracksettings-component"
        actions={this.props.actions} />
    );
  }
}

TrackSettings.displayName = 'TrackSettings';
TrackSettings.propTypes = {
  actions: React.PropTypes.shape({
    startAddingPoint: React.PropTypes.func.isRequired,
    toggleDoubleLine: React.PropTypes.func.isRequired,
    setMarkerSpacing: React.PropTypes.func.isRequired,
    setGateSpacing: React.PropTypes.func.isRequired,
    setTrackWidth: React.PropTypes.func.isRequired,
    renderPreview: React.PropTypes.func.isRequired,
    setMarkerType: React.PropTypes.func.isRequired,
    toggleGates: React.PropTypes.func.isRequired,
    deletePoint: React.PropTypes.func.isRequired,
    closeTrack: React.PropTypes.func.isRequired,
    openTrack: React.PropTypes.func.isRequired,
    setName: React.PropTypes.func.isRequired,
    setMap: React.PropTypes.func.isRequired,
  }),
  track: React.PropTypes.shape({
    markerSpacing: React.PropTypes.number.isRequired,
    gateSpacing: React.PropTypes.number.isRequired,
    gatesEnabled: React.PropTypes.bool.isRequired,
    markerType: React.PropTypes.string.isRequired,
    doubleLine: React.PropTypes.bool.isRequired,
    closed: React.PropTypes.bool.isRequired
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
  }).isRequired,
  liftoff: React.PropTypes.shape({
    markers: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        value: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
      })
    ).isRequired
  })
};
/* istanbul ignore next */
TrackSettings.defaultProps = {
  actions: {
    startAddingPoint: () => {},
    toggleDoubleLine: () => {},
    setMarkerSpacing: () => {},
    setGateSpacing: () => {},
    toggleGridSnap: () => {},
    setTrackWidth: () => {},
    renderPreview: () => {},
    setMarkerType: () => {},
    toggleGates: () => {},
    deletePoint: () => {},
    closeTrack: () => {},
    openTrack: () => {},
    setName: () => {},
    setMap: () => {}
  },
  track: {
    markerType: 'DiscConeBlue01 (Tracksettings.js)',
    gatesEnabled: false,
    markerSpacing: 20,
    doubleLine: false,
    gateSpacing: 100,
    closed: false
  },
  xml: {
    download: false,
    track: {
      id: 'Track Id',
      value: '--- Hit preview to render Track XML ---'
    },
    race: {
      id: 'Race Id',
      value: '--- Gates need to be enabled ---'
    }
  },
  liftoff: {
    markers: []
  }
};

export default TrackSettings;
