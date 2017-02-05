import React from 'react';
import {
  FormControl
} from 'react-bootstrap';

const markerTypes = [
  {
    display: 'Blue Disc',
    name: 'DiscConeBlue01'
  },
  {
    display: 'Orange Disc',
    name: 'DiscConeOrange01'
  },
  {
    display: 'Red Disc',
    name: 'DiscConeRed01'
  },
  {
    display: 'Yellow Disc',
    name: 'DiscConeYellow01'
  },
  {
    display: 'Magenta Disc',
    name: 'DiscConeMagenta01'
  },
  {
    display: 'Greend Disc',
    name: 'DiscConeGreen01'
  },
  {
    display: 'Traffic Cone',
    name: 'TrafficCone01'
  },
  {
    display: 'Danger Pyramid',
    name: 'DangerPyramid01'
  },
  {
    display: 'Air Polygon',
    name: 'AirPylonLuGusStudios01'
  }
];

class MarkerSelection extends React.Component {

  constructor(props) {
    super(props);

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(event) {
    this.props.setMarkerType(event.target.value);
  }

  render() {
    return (
      <FormControl
        className="markerselection-component"
        componentClass="select"
        onChange={this.handleSelectChange}
      >
        {markerTypes.map(marker => (
          <option value={marker.name} key={marker.name}>
            {marker.display}
          </option>
        ))}
      </FormControl>
    );
  }
}

MarkerSelection.displayName = 'MarkerSelection';
MarkerSelection.propTypes = {
  setMarkerType: React.PropTypes.func.isRequired
};
/* istanbul ignore next */
MarkerSelection.defaultProps = {
  setMarkerType: () => {}
};

export default MarkerSelection;
