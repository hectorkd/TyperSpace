import ScrambleCard from './ScrambleCard.png';
import SymbolsCard from './SymbolsCard.png';
import LongWordCard from './LongWordCard.png';

type PowerUpObj = {
  [powerUp: string]: string;
};

const powerCardsObj: PowerUpObj = {
  ScrambleCard,
  SymbolsCard,
  LongWordCard,
};

export default powerCardsObj;
