import IgameData from './IGameData';

export default interface IPlayer {
  userName: string;
  color: string;
  isHost: boolean;
  gameData: IgameData;
}
