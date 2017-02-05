import React from 'react';
import cssmodules from 'react-css-modules';
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  Button
} from 'react-bootstrap';
import styles from './open.cssmodule.scss';
import MonitoredTextbox from './MonitoredTextbox';

class Open extends React.Component {

  constructor(props) {
    super(props);

    this.handleMapChange = this.handleMapChange.bind(this);
  }

  handleMapChange(event) {
    this.props.actions.setMap(event.target.value);
  }

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

              <FormControl
                componentClass="select"
                onChange={this.handleMapChange}
              >
                <option value="LiftoffArena">Liftoff Arena</option>
                <option value="TheDrawingBoard">The Drawing Board</option>
              </FormControl>&nbsp;

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
    name: React.PropTypes.string.isRequired
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
    name: 'Trackname'
  }
};

export default cssmodules(Open, styles);
