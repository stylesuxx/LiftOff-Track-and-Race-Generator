import React from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';

class MonitoredTextbox extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.action(event.target.value);
  }

  render() {
    const className = `${this.props.type}-input`;
    let label = '';
    if (this.props.label !== '') {
      label = (<ControlLabel>{this.props.label}:&nbsp;</ControlLabel>);
    }

    return (
      <FormGroup className="monitoredtextbox-component">
        {label}
        <FormControl
          className={className}
          type={this.props.type}
          onChange={this.handleChange}
          defaultValue={this.props.value} />
      </FormGroup>
    );
  }
}

MonitoredTextbox.displayName = 'MonitoredTextbox';
MonitoredTextbox.propTypes = {
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  action: React.PropTypes.func.isRequired,
  /* eslint-disable */
  value: React.PropTypes.any.isRequired
  /* eslint-enable */
};
/* istanbul ignore next */
MonitoredTextbox.defaultProps = {
  action: () => {},
  label: 'Label',
  type: 'number',
  value: 100
};

export default MonitoredTextbox;
