import blueRocket from './rocketBlue.svg';
import coralRocket from './rocketCoral.svg';
import limeRocket from './rocketLime.svg';
import orangeRocket from './rocketOrange.svg';
import pinkRocket from './rocketPink.svg';
import purpleRocket from './rocketPurple.svg';
import redRocket from './rocketRed.svg';
import tealRocket from './rocketTeal.svg';

type RocketObj = {
  [rocket: string]: string;
};

const rocketObj: RocketObj = {
  blueRocket,
  coralRocket,
  limeRocket,
  orangeRocket,
  pinkRocket,
  purpleRocket,
  redRocket,
  tealRocket,
};

export default rocketObj;
