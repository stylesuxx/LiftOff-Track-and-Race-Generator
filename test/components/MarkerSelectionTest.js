import React from 'react';
import { shallow } from 'enzyme';
import MarkerSelection from 'components/trackSettings/MarkerSelection.js';

describe('<MarkerSelection />', function () {

  let component;
  let action;
  beforeEach(function () {
    action = sinon.spy();
    component = shallow(<MarkerSelection setMarkerType={action} />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "markerselection-component"', function () {
      expect(component.hasClass('markerselection-component')).to.equal(true);
    });

    it('should have a className of "markerselection-component"', function () {
      const wrapper = component.find('FormControl');
      wrapper.simulate('change', { target: 'foo' });

      expect(action.called).to.be.true;
    });
  });
});
