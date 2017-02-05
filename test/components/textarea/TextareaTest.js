import React from 'react';
import { shallow } from 'enzyme';
import { NavItem } from 'react-bootstrap';
import Textarea from 'components/textarea/Textarea.js';
import TextareaTab from 'components/textarea/TextareaTab.js';

describe('<Textarea />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Textarea />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "textarea-component"', function () {
      expect(component.hasClass('textarea-component')).to.equal(true);
    });

    it('should only have one tab when gates are disabled', function () {
      expect(component.find(TextareaTab)).to.have.length(1);
    });
  });

  describe('when rendering the component with gates', function () {
    it('should have a className of "textarea-component"', function () {
      component = shallow(<Textarea gatesEnabled={true} />);
      expect(component.hasClass('textarea-component')).to.equal(true);
    });

    it('should have two tabs when gates area enabled', function () {
      component = shallow(<Textarea gatesEnabled={true} />);
      expect(component.find(TextareaTab)).to.have.length(2);
    });
  });
});
