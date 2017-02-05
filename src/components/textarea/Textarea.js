import React from 'react';
import cssmodules from 'react-css-modules';
import {
  Tabs
} from 'react-bootstrap';
import styles from './textarea.cssmodule.scss';
import TextareaTab from './TextareaTab';

class Textarea extends React.Component {
  render() {
    const gatesEnabled = this.props.gatesEnabled;

    let raceTab = '';
    if (gatesEnabled) {
      raceTab = (
        <TextareaTab
          title="Race"
          text={this.props.raceText}
          eventKey={2} />
      );
    }

    return (
      <Tabs
        defaultActiveKey={1}
        className="textarea-component"
        styleName="textarea-component"
        id="textarea-tabs" >

        <TextareaTab
          title="Track"
          text={this.props.trackText}
          eventKey={1} />

        {raceTab}

      </Tabs>
    );
  }
}

Textarea.displayName = 'TextareaTextarea';
Textarea.propTypes = {
  gatesEnabled: React.PropTypes.bool.isRequired,
  trackText: React.PropTypes.string.isRequired,
  raceText: React.PropTypes.string.isRequired
};
Textarea.defaultProps = {
  gatesEnabled: false,
  trackText: 'Initial track text (Textarea)',
  raceText: 'Initial race text (Textarea)'
};

export default cssmodules(Textarea, styles);
