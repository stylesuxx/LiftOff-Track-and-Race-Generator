import React from 'react';
import { shallow } from 'enzyme';
import MonitoredTextbox from 'components/trackSettings/MonitoredTextbox.js';

describe('<MonitoredTextbox />', function () {

  let component;
  let action;
  beforeEach(function () {
    action = sinon.spy();
    component = shallow(<MonitoredTextbox action={action}/>);
  });

  describe('when rendering the component', function () {

    it('should have a className of "gatespacing-component"', function () {
      expect(component.hasClass('monitoredtextbox-component')).to.equal(true);
    });

    it('should call onChange when updating gate spacing', function() {
      const spacingWrapper = component.find('FormControl');
      spacingWrapper.simulate('change', {target: {value: 200}});

      expect(action.called).to.be.true;
    });
  });

  describe('when rendering the component with empty label', function () {

    it('should have a className of "gatespacing-component"', function () {
      component = shallow(<MonitoredTextbox action={action} label="" />);

      expect(component.hasClass('monitoredtextbox-component')).to.equal(true);
    });
  });
});
