import IgameData from './IGameData';

export interface IPlayer {
  userName: string,
  color: string,
  isHost: boolean,
  gameData: IgameData
}