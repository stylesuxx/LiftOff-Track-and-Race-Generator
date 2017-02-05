import React from 'react';
import { shallow } from 'enzyme';
import Footer from 'components/Footer.js';

describe('<Footer />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Footer />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "footer-component"', function () {
      expect(component.hasClass('footer-component')).to.equal(true);
    });
  });
});
