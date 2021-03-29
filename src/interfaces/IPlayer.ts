import IGameData from './IGameData';
import IPowerUps from './IPowerUps';

export default interface IPlayer {
  userId: string;
  userName: string;
  color: string;
  isHost: boolean;
  gameData: IGameData;
  userParagraph: string;
  appliedPUs: IPowerUps;
  availablePUs: IPowerUps;
  isReady: boolean;
}
