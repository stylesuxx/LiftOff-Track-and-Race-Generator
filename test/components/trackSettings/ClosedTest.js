import React from 'react';
import { shallow, mount } from 'enzyme';
import Closed from 'components/trackSettings/Closed.js';

describe('<Closed />', function () {

  let component;
  let actions;
  let track;
  beforeEach(function () {
    track = {
      gatesEnabled: false,
      markerSpacing: 20,
      gateSpacing: 100,
      doubleLine: true,
      trackWidth: 17.5,
      download: false,
      trackText: 'Initial Track text',
      raceText: 'Initial Race text',
      trackId: 'Track Id',
      raceId: 'Race Id'
    };

    actions = {
      setMarkerSpacing: sinon.spy(),
      toggleDoubleLine: sinon.spy(),
      setGateSpacing: sinon.spy(),
      setMarkerType: sinon.spy(),
      renderPreview: sinon.spy(),
      setTrackWidth: sinon.spy(),
      toggleGates: sinon.spy(),
      openTrack: sinon.spy(),
    };

    component = mount(<Closed actions={actions} track={track} />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "closed-component"', function () {
      expect(component.hasClass('closed-component')).to.equal(true);
    });

    it('should call onChange when updating marker spacing', function() {
      const spacingWrapper = component.find('MonitoredTextbox').first();
      spacingWrapper.simulate('change', {target: {value: 200}});

      expect(actions.toggleDoubleLine.called).to.be.false;
      expect(actions.setGateSpacing.called).to.be.false;
    });
  });

  describe('when redering the component with gates', function () {
    it('should have a className of "closed-component"', function () {
      track.gatesEnabled = true;
      component = shallow(<Closed track={track} />);

      expect(component.hasClass('closed-component')).to.equal(true);
    });
  });

  describe('when downloads are enabled', function () {
    it('should have a className of "closed-component"', function () {
      track.download = true;
      component = mount(<Closed track={track} />);
      const wrapper = component.find('.download');
      wrapper.simulate('click');

      expect(component.hasClass('closed-component')).to.equal(true);
    });
  });

  describe('when downloads and gates enabled', function () {
    it('should have a className of "closed-component"', function () {
      track.download = true;
      track.gatesEnabled = true;
      track.doubleLine = false;

      component = mount(<Closed track={track} />);
      const wrapper = component.find('.download');
      wrapper.simulate('click');

      expect(component.hasClass('closed-component')).to.equal(true);
    });
  });
});
