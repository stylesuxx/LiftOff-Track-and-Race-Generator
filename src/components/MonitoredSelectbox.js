import React from 'react';
import {
  FormControl
} from 'react-bootstrap';

class MonitoredSelectbox extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.updateSelection(event.target.value);
  }

  render() {
    return (
      <FormControl
        className="monitoredselectbox-component"
        componentClass="select"
        onChange={this.handleChange}
      >
        {this.props.options.map(option => (
          <option value={option.value} key={option.value}>
            {option.text}
          </option>
        ))}
      </FormControl>
    );
  }
}

MonitoredSelectbox.displayName = 'MonitoredSelectbox';
MonitoredSelectbox.propTypes = {
  updateSelection: React.PropTypes.func.isRequired,
  options: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired
    })
  )
};
/* istanbul ignore next */
MonitoredSelectbox.defaultProps = {
  updateSelection: () => {},
  options: []
};

export default MonitoredSelectbox;
