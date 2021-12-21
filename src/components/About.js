import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './about.cssmodule.scss';

class About extends React.Component {

  render() {
    return (
      <div className="about-component">

        <div styleName="about-wrapper">
          <h2 styleName="about-headline">About</h2>

          <p>This is a track and race generator for the{' '}
            <a href="http://www.liftoff-game.com/">LiftOff Quadcopter Racing
            flight simulator</a>.</p>

          <p>You add points that are connected by a quadratic curve of which
            you can choose the slope of. In the first step you can add as many
            points as you like. When you are done, click <i>Close Track</i> to
            process to the second step of track generation: Track width
            settings, Marker and Gate placement and finally <strong>Track and
            Race generation</strong>.</p>

          <p>The app will generate XML for the track and for the race if you
            chose so. The results simply need to be copied to your LiftOff
            Track and Race directories.</p>

          <p><b>Tip:</b> Press <i>[CTRL]</i> and scroll your mousewheel to scale the page to
            fit your screen. Press <i>[F11]</i> to enable full screen.</p>
        </div>

        <div className="disclaimer">
          <h3>Disclaimer</h3>
          <p>This software is <b>not officialy supported by LuGus Studio</b>.
          For support go to the <a href="https://github.com/stylesuxx/LiftOff-Track-and-Race-Generator">
          github repository</a> of this project.</p>
        </div>

        <div className="shout-outs">
          <h3>Shout Outs</h3>
          <p>Thanks to φ for her mad maths skillz, and <a href="https://twitter.com/J4y4r">@j4y4r</a> and <a href="https://twitter.com/horrendus">@horrendus</a> for testing.</p>
        </div>
        <div className="compatibility">
          <h3>Compatibility</h3>

          <p>This applications should be compatible with every modern web browser.
            If you are experiencing problems, feel free to
            <a href="https://github.com/stylesuxx/LiftOff-Track-and-Race-Generator/issues">
            file an issue</a> explaining your problem with exact brower information,
            preferably including a screenshot.</p>

          <p>Due to the nature of drawing on a canvas of fixed size, this might
            not be the best experience on mobile devices. Preferably use a screen
            with some insane resolution. Or zoom to fit.</p>

          <p><b>Latest tested LiftOff Version: 1.3.15</b></p>
        </div>

        <div className="video">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/QRGGEBZoILc" allowFullScreen />
        </div>
      </div>
    );
  }
}

About.displayName = 'About';
About.propTypes = {};
About.defaultProps = {};

export default cssmodules(About, styles);
