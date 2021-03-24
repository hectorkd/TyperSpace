import IGameData from './IGameData';

export default interface IPlayer {
  userId: string;
  userName: string;
  color: string;
  isHost: boolean;
  gameData: IGameData;
}
