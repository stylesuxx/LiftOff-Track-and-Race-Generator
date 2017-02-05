import React from 'react';
import { shallow } from 'enzyme';
import TrackSettings from 'components/trackSettings/TrackSettings.js';

describe('<TrackSettings />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<TrackSettings />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "tracksettings-component"', function () {
      expect(component.hasClass('tracksettings-component')).to.equal(true);
    });
  });

  describe('when rendering the component with a closed track', function () {
    var track = {
      closed: true,
      gateSpacing: 20,
      doubleLine: false,
      markerSpacing: 20,
      gatesEnabled: false,
      trackWidth: 17.5,
      download: false,
      trackText: 'Initial Track text',
      raceText: 'Initial Race text',
      trackId: 'Track Id',
      raceId: 'Race Id'
    };

    component = shallow(<TrackSettings track={track} />);
    it('should have a className of "tracksettings-component"', function () {
      expect(component.hasClass('tracksettings-component')).to.equal(true);
    });
  });
});
