import React from 'react';
import { shallow } from 'enzyme';
import TextareaTab from 'components/textarea/TextareaTab.js';

describe('<TextareaTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<TextareaTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "textareatab-component"', function () {
      expect(component.hasClass('textareatab-component')).to.equal(true);
    });
  });
});
