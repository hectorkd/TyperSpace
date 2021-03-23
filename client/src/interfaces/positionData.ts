export default interface IpositionData {
  [socketId: string]: {
    currIndex: number;
    currChar: string;
  };
}
