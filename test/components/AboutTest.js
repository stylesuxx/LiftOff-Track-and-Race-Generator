import React from 'react';
import { shallow } from 'enzyme';
import About from 'components/About.js';

describe('<About />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<About />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "about-component"', function () {
      expect(component.hasClass('about-component')).to.equal(true);
    });
  });
});
