import ScrambleCard from './ScrambleCard.svg';
import SymbolsCard from './SymbolsCard.svg';
import LongWordCard from './LongWordCard.svg';

type PowerUpObj = {
  [powerUp: string]: string;
};

const powerCardsObj: PowerUpObj = {
  ScrambleCard,
  SymbolsCard,
  LongWordCard,
};

export default powerCardsObj;
