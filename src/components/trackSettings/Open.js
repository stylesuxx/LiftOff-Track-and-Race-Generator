import React from 'react';
import cssmodules from 'react-css-modules';
import {
  FormGroup,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import styles from './open.cssmodule.scss';
import MonitoredTextbox from '../MonitoredTextbox';
import MonitoredSelectbox from '../MonitoredSelectbox';

class Open extends React.Component {

  render() {
    return (
      <Row className="open-component">
        <Col md={12}>
          <Form inline>
            <FormGroup>

              <Button
                className="add-button"
                bsStyle="success"
                onClick={this.props.actions.startAddingPoint}
              >Add Point</Button>&nbsp;

              <Button
                className="delete-buttong"
                bsStyle="warning"
                onClick={this.props.actions.deletePoint}
              >Delete Point</Button>&nbsp;

              <MonitoredSelectbox
                updateSelection={this.props.actions.setMap}
                selected={this.props.track.map}
                options={this.props.liftoff.maps}
              />&nbsp;

              <MonitoredTextbox
                label=""
                value={this.props.track.name}
                action={this.props.actions.setName}
                type="text"
              />&nbsp;

              <Button
                className="close-button"
                bsStyle="primary"
                onClick={this.props.actions.closeTrack}
              >Close Track</Button>&nbsp;

            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }
}

Open.displayName = 'TrackSettingsOpen';
Open.propTypes = {
  actions: React.PropTypes.shape({
    startAddingPoint: React.PropTypes.func.isRequired,
    deletePoint: React.PropTypes.func.isRequired,
    closeTrack: React.PropTypes.func.isRequired,
    setName: React.PropTypes.func.isRequired,
    setMap: React.PropTypes.func.isRequired,
  }).isRequired,
  track: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    map: React.PropTypes.string.isRequired
  }),
  liftoff: React.PropTypes.shape({
    maps: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        value: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
      })
    )
  })
};
/* istanbul ignore next */
Open.defaultProps = {
  actions: {
    startAddingPoint: () => {},
    deletePoint: () => {},
    closeTrack: () => {},
    setName: () => {},
    setMap: () => {}
  },
  track: {
    name: 'name (Open.js)',
    map: 'map (Open.js)',
  },
  liftoff: {
    maps: []
  }
};

export default cssmodules(Open, styles);
