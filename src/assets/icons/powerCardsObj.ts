import ScrambleCard from './scramble-powerup.png';
import SymbolsCard from './ReplaceSymbol-powerup.png';

type PowerUpObj = {
  [powerUp: string]: string;
};

const powerCardsObj: PowerUpObj = {
  ScrambleCard,
  SymbolsCard,
};

export default powerCardsObj;
