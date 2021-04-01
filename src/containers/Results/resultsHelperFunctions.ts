import IPlayer from '../../interfaces/IPlayer';

const sortResult = (players: IPlayer[], finalState: boolean) => {
  if (!finalState) {
    players.sort((a: IPlayer, b: IPlayer): number => {
      if (a.gameData.WPM && b.gameData.WPM) {
        if (a.gameData.WPM < a.gameData.WPM) return 1;
        if (a.gameData.WPM > b.gameData.WPM) return -1;
        return 0;
      } else if (a.gameData.WPM && !b.gameData.WPM) {
        return -1;
      } else {
        return 1;
      }
    });
  } else {
    players.sort((a: IPlayer, b: IPlayer): number => {
      if (a.WPMAverage && b.WPMAverage) {
        if (a.WPMAverage < a.WPMAverage) return 1;
        if (a.WPMAverage > b.WPMAverage) return -1;
        return 0;
      } else if (a.WPMAverage && !b.WPMAverage) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  return players;
};

export default sortResult;
