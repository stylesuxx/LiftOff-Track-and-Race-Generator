import React from 'react';
import cssmodules from 'react-css-modules';
import {
  Tab
} from 'react-bootstrap';
import styles from './textareatab.cssmodule.scss';

class TextareaTab extends React.Component {

  render() {
    return (
      <Tab
        className="textareatab-component"
        styleName="textareatab-component"
        eventKey={this.props.eventKey}
        title={this.props.title} >

        <textarea
          styleName={styles.textarea}
          readOnly
          value={this.props.text} />
      </Tab>
    );
  }
}

TextareaTab.displayName = 'TextareaTextareaTab';
TextareaTab.propTypes = {
  eventKey: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
};
TextareaTab.defaultProps = {
  title: 'Title missing',
  text: 'Text missing',
  eventKey: 0
};

export default cssmodules(TextareaTab, styles);
