import blueRocket from './rocket1blue.png';
import yellowRocket from './rocket2yellow.png';
import orangeRocket from './rocket3orange.png';
import pinkRocket from './rocket4pink.png';
import violetRocket from './rocket5violet.png';

type RocketObj = {
  [rocket: string]: string;
};

const rocketObj: RocketObj = {
  blueRocket,
  yellowRocket,
  orangeRocket,
  pinkRocket,
  violetRocket,
};

export default rocketObj;
