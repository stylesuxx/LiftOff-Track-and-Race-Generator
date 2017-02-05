import React from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';
import cssmodules from 'react-css-modules';

import styles from './footer.cssmodule.scss';

class Footer extends React.Component {

  render() {
    return (
      <Row className="footer-component">
        <Col md={12}>
          <footer className="footer" styleName={styles.footer}>
            <p>&copy; <a href="mailto:stylesuxx@gmail.com">stylesuxx</a> 2017
              | Powered by <a href="https://github.com/stylesuxx/generator-react-webpack-redux">React, Redux</a> & Canvas | Hosted on <a href="https://pages.github.com/">Gihub Pages</a> |&nbsp;
              <a href="https://github.com/stylesuxx/LiftOff-Track-and-Race-Generator">Github Repository</a> | <a href="https://travis-ci.org/stylesuxx/LiftOff-Track-and-Race-Generator/">Travis CI</a></p>
          </footer>
        </Col>
      </Row>
    );
  }
}

Footer.displayName = 'Footer';
Footer.propTypes = {};
Footer.defaultProps = {};

export default cssmodules(Footer, styles);
