import IPlayer from '../../interfaces/IPlayer';
import IPostitionData from '../../interfaces/IPositionData';

interface ahead {
  player: string;
  idx: number;
  color: string;
}

const calculateRocketPositions = (
  currPlayerIndexes: IPostitionData,
  setAheadState: React.Dispatch<React.SetStateAction<ahead>>,
  setBehindState: React.Dispatch<React.SetStateAction<ahead>>,
  currPlayer: string,
): void => {
  let newAhead = { player: '', idx: 0, color: '' };
  let newBehind = { player: '', idx: 0, color: '' };
  for (const player in currPlayerIndexes) {
    if (
      currPlayerIndexes[currPlayer] &&
      player !== currPlayer &&
      currPlayerIndexes[player].currIndex >=
        currPlayerIndexes[currPlayer].currIndex
    ) {
      if (
        !newAhead.player ||
        currPlayerIndexes[player].currIndex < newAhead.idx
      ) {
        newAhead = {
          player: player,
          idx: currPlayerIndexes[player].currIndex,
          color: currPlayerIndexes[player].color,
        };
      }
    }
    if (
      currPlayerIndexes[currPlayer] &&
      player !== currPlayer &&
      currPlayerIndexes[player].currIndex <
        currPlayerIndexes[currPlayer].currIndex
    ) {
      if (
        !newBehind.player ||
        currPlayerIndexes[player].currIndex > newBehind.idx
      ) {
        newBehind = {
          player: player,
          idx: currPlayerIndexes[player].currIndex,
          color: currPlayerIndexes[player].color,
        };
      }
    }
  }
  setAheadState(newAhead);
  setBehindState(newBehind);
};

const calculateFirstPlace = (
  currPlayerIndexes: IPostitionData,
  setFirstPlaceState: React.Dispatch<React.SetStateAction<ahead>>,
  users: IPlayer[],
): void => {
  let newFirstPlace: ahead = { player: '', idx: 0, color: '' };
  for (const player in currPlayerIndexes) {
    if (
      !newFirstPlace ||
      currPlayerIndexes[player].currIndex > newFirstPlace.idx
    ) {
      let userName = '';
      for (const user in users) {
        if (users[user].userId === player) {
          userName = users[user].userName;
        }
      }
      newFirstPlace = {
        player: userName,
        idx: currPlayerIndexes[player].currIndex,
        color: currPlayerIndexes[player].color,
      };
    }
  }
  setFirstPlaceState(newFirstPlace);
};

const helperFunctions = {
  calculateRocketPositions,
  calculateFirstPlace,
};

export default helperFunctions;
