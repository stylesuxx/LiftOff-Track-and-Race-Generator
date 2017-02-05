import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import React from 'react';
import cssmodules from 'react-css-modules';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Button
} from 'react-bootstrap';
import styles from './closed.cssmodule.scss';

import MonitoredTextbox from './MonitoredTextbox';
import MarkerSelection from './MarkerSelection';

class Closed extends React.Component {
  constructor(props) {
    super(props);

    this.zipButtonHandler = this.zipButtonHandler.bind(this);
  }

  zipButtonHandler() {
    const gatesEnabled = this.props.track.gatesEnabled;
    const trackText = this.props.xml.track.value;
    const raceText = this.props.xml.race.value;
    const trackId = this.props.xml.track.id;
    const raceId = this.props.xml.race.id;

    const fileName = `${trackId}.zip`;
    const trackPath = `Liftoff_Data/Tracks/${trackId}/${trackId}.track`;
    const racePath = `Liftoff_Data/Races/${raceId}/${raceId}.race`;

    const zip = new JSZip();
    zip.file(trackPath, trackText);

    if (gatesEnabled) {
      zip.file(racePath, raceText);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, fileName);
    });
  }

  render() {
    const gatesEnabled = this.props.track.gatesEnabled;
    const doubleLine = this.props.track.doubleLine;
    const download = this.props.track.download;

    const toggleGates = this.props.actions.toggleGates;
    const toggleDoubleLine = this.props.actions.toggleDoubleLine;

    const gateText = gatesEnabled ? 'Disable Gates' : 'Enable Gates';
    const doubleLineText = doubleLine ? 'Single Line' : 'Double Line';
    const closedText = 'Back';

    let gateSpacing = '';
    if (gatesEnabled) {
      gateSpacing = (
        <MonitoredTextbox
          action={this.props.actions.setGateSpacing}
          value={this.props.track.gateSpacing}
          label="Spacing"
          type="number" />
      );
    }

    let trackWidth = '';
    if (doubleLine) {
      trackWidth = (
        <MonitoredTextbox
          action={this.props.actions.setTrackWidth}
          value={this.props.track.trackWidth}
          label="Width"
          type="number" />
      );
    }

    let downloadButton = '';
    if (download) {
      downloadButton = (
        <FormGroup className="pull-right">
          <Button
            className="download"
            bsStyle="success"
            onClick={this.zipButtonHandler}
          >Download ZIP</Button>
        </FormGroup>
      );
    }

    return (
      <Row className="closed-component" styleName="closed-component">
        <Col md={12}>
          <Form inline>
            <FormGroup>
              <Button
                onClick={this.props.actions.openTrack}
                bsStyle="warning"
                >{closedText}</Button>&nbsp;

              <Button
                bsStyle="primary"
                onClick={this.props.actions.renderPreview}
              >Preview</Button>&nbsp;

              <MonitoredTextbox
                className="marker-spacing"
                action={this.props.actions.setMarkerSpacing}
                value={this.props.track.markerSpacing}
                label="Spacing" />&nbsp;

              <MarkerSelection
                setMarkerType={this.props.actions.setMarkerType}
               />&nbsp;

              <Button
                className={styles.fixedWidth}
                onClick={toggleDoubleLine}>{doubleLineText}</Button>&nbsp;

              {trackWidth}&nbsp;

              <Button
                className={styles.fixedWidth}
                onClick={toggleGates}>{gateText}</Button>&nbsp;

              {gateSpacing}&nbsp;
            </FormGroup>&nbsp;

            {downloadButton}
          </Form>
        </Col>
      </Row>
    );
  }
}

Closed.displayName = 'TrackSettingsClosed';
Closed.propTypes = {
  actions: React.PropTypes.shape({
    toggleDoubleLine: React.PropTypes.func.isRequired,
    setMarkerSpacing: React.PropTypes.func.isRequired,
    setGateSpacing: React.PropTypes.func.isRequired,
    setTrackWidth: React.PropTypes.func.isRequired,
    renderPreview: React.PropTypes.func.isRequired,
    setMarkerType: React.PropTypes.func.isRequired,
    toggleGates: React.PropTypes.func.isRequired,
    openTrack: React.PropTypes.func.isRequired
  }),
  track: React.PropTypes.shape({
    markerSpacing: React.PropTypes.number.isRequired,
    gateSpacing: React.PropTypes.number.isRequired,
    trackWidth: React.PropTypes.number.isRequired,
    gatesEnabled: React.PropTypes.bool.isRequired,
    doubleLine: React.PropTypes.bool.isRequired,
    download: React.PropTypes.bool.isRequired
  }),
  xml: React.PropTypes.shape({
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
/* istanbul ignore next */
Closed.defaultProps = {
  actions: {
    toggleDoubleLine: () => {},
    setMarkerSpacing: () => {},
    setGateSpacing: () => {},
    renderPreview: () => {},
    setTrackWidth: () => {},
    setMarkerType: () => {},
    toggleGates: () => {},
    trackWidth: () => {},
    openTrack: () => {}
  },
  track: {
    gatesEnabled: false,
    doubleLine: false,
    markerSpacing: 20,
    gateSpacing: 100,
    trackWidth: 17.5,
    download: false
  },
  xml: {
    track: {
      id: 'Track Id',
      value: '--- Hit preview to render Track XML ---'
    },
    race: {
      id: 'Race Id',
      value: '--- Gates need to be enabled ---'
    }
  }
};

export default cssmodules(Closed, styles);
