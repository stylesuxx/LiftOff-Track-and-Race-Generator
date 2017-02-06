/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {} from '../actions/const';

const initialState = {
  markers: [
    {
      value: 'DiscConeBlue01',
      text: 'Blue Disc'
    },
    {
      value: 'DiscConeOrange01',
      text: 'Orange Disc'
    },
    {
      value: 'DiscConeRed01',
      text: 'Red Disc'
    },
    {
      value: 'DiscConeYellow01',
      text: 'Yellow Disc'
    },
    {
      value: 'DiscConeMagenta01',
      text: 'Magenta Disc'
    },
    {
      value: 'DiscConeGreen01',
      text: 'Greend Disc'
    },
    {
      value: 'TrafficCone01',
      text: 'Traffic Cone'
    },
    {
      value: 'DangerPyramid01',
      text: 'Danger Pyramid'
    },
    {
      value: 'AirPylonLuGusStudios01',
      text: 'Air Polygon'
    }
  ],
  maps: [
    {
      value: 'LiftoffArena',
      text: 'Liftoff Arena'
    },
    {
      value: 'TheDrawingBoard',
      text: 'The Drawing Board'
    }
  ]
};

function reducer(state = initialState, action) {
  // const nextState = Object.assign({}, state);

  switch (action.type) {
    default: {
      return state;
    }
  }
}

module.exports = reducer;
