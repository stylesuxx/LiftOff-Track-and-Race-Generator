import React from 'react';
import { mount } from 'enzyme';
import MonitoredSelectbox from 'components/MonitoredSelectbox.js';

describe('<MonitoredSelectbox />', function () {

  let component;
  let options;
  let handler;
  beforeEach(function () {
    options= [
      {
        value: 'option_1',
        text: 'Option 1'
      },
      {
        value: 'option_2',
        text: 'Option 2'
      }
    ]
    handler = sinon.spy()
    component = mount(<MonitoredSelectbox updateSelection={handler} options={options} />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "monitoredselectbox-component"', function () {
      component = mount(<MonitoredSelectbox />);
      expect(component.hasClass('monitoredselectbox-component')).to.equal(true);
    });
  });

  describe('when rendering the component with options', function () {

    it('should have a className of "monitoredselectbox-component"', function () {
      expect(component.hasClass('monitoredselectbox-component')).to.equal(true);
    });

    it('should display the options', function () {
      const wrapper = component.find('option');
      expect(wrapper.length).to.eql(2);
    });

    it('should call the updateSelection handler', function () {
      const wrapper = component.find('select');
      wrapper.simulate('change');
      expect(handler.called).to.be.true;
    });
  });
});
