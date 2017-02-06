import React from 'react';
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  Checkbox,
  Clearfix
} from 'react-bootstrap';
import './app.css';

import TrackSettings from './trackSettings/TrackSettings';
import Textarea from './textarea/Textarea';
import Canvas from './Canvas';
import Footer from './Footer';
import About from './About';

class AppComponent extends React.Component {

  render() {
    let rightColumn = <About />;
    if (this.props.track.closed) {
      rightColumn = (<Textarea
        gatesEnabled={this.props.track.gatesEnabled}
        trackText={this.props.xml.track.value}
        raceText={this.props.xml.race.value} />);
    }

    return (
      <Grid className="index">

        <TrackSettings
          actions={this.props.actions}
          canvas={this.props.canvas}
          track={this.props.track}
          xml={this.props.xml}
          liftoff={this.props.liftoff} />

        <Row>
          <Col md={12}>
            <Form inline>
              <FormGroup>
                <Checkbox
                  inline
                  onChange={this.props.actions.toggleGridSnap}
                >snap to grid</Checkbox>
              </FormGroup>
            </Form>
          </Col>
        </Row>

        <div className="main-content">

          <div className="canvas-wrapper">
            <Canvas
              actions={this.props.actions}
              canvas={this.props.canvas}
              track={this.props.track} />
          </div>

          <div className="about-wrapper">{rightColumn}</div>

          <Clearfix />
        </div>

        <Footer />
      </Grid>
    );
  }
}

AppComponent.propTypes = {
  actions: React.PropTypes.shape({
    startAddingPoint: React.PropTypes.func.isRequired,
    setMarkerSpacing: React.PropTypes.func.isRequired,
    toggleDoubleLine: React.PropTypes.func.isRequired,
    stopAddingPoint: React.PropTypes.func.isRequired,
    setGateSpacing: React.PropTypes.func.isRequired,
    toggleGridSnap: React.PropTypes.func.isRequired,
    enableDownload: React.PropTypes.func.isRequired,
    setTrackWidth: React.PropTypes.func.isRequired,
    renderPreview: React.PropTypes.func.isRequired,
    setMarkerType: React.PropTypes.func.isRequired,
    setTrackText: React.PropTypes.func.isRequired,
    setRaceText: React.PropTypes.func.isRequired,
    toggleGates: React.PropTypes.func.isRequired,
    deletePoint: React.PropTypes.func.isRequired,
    closeTrack: React.PropTypes.func.isRequired,
    openTrack: React.PropTypes.func.isRequired,
    setMap: React.PropTypes.func.isRequired
  }),
  track: React.PropTypes.shape({
    markerSpacing: React.PropTypes.number.isRequired,
    gateSpacing: React.PropTypes.number.isRequired,
    gatesEnabled: React.PropTypes.bool.isRequired,
    markerType: React.PropTypes.string.isRequired,
    trackWidth: React.PropTypes.number.isRequired,
    doubleLine: React.PropTypes.bool.isRequired,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    closed: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
  }),
  canvas: React.PropTypes.shape({
    trackRendered: React.PropTypes.bool.isRequired,
    nodeDeleted: React.PropTypes.bool.isRequired,
    addingNode: React.PropTypes.bool.isRequired,
    gridSnap: React.PropTypes.bool.isRequired
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
AppComponent.defaultProps = {
  actions: {
    startAddingPoint: () => {},
    setMarkerSpacing: () => {},
    toggleDoubleLine: () => {},
    stopAddingPoint: () => {},
    enableDownload: () => {},
    setGateSpacing: () => {},
    toggleGridSnap: () => {},
    renderPreview: () => {},
    setMarkerType: () => {},
    setTrackWidth: () => {},
    toggleClosed: () => {},
    setTrackText: () => {},
    setRaceText: () => {},
    toggleGates: () => {},
    deletePoint: () => {},
    closeTrack: () => {},
    openTrack: () => {},
    setMap: () => {}
  },
  track: {
    markerType: 'DiscConeBlue01 (App.js)',
    name: 'Trackname 01 (App.js)',
    gatesEnabled: false,
    markerSpacing: 20,
    doubleLine: false,
    trackWidth: 17.5,
    gateSpacing: 100,
    closed: false,
    height: 1000,
    width: 600
  },
  canvas: {
    trackRendered: true,
    nodeDeleted: true,
    addingNode: false,
    gridSnap: false
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

export default AppComponent;
