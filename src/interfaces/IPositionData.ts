export default interface IpositionData {
  [socketId: string]: {
    currIndex: number;
    color: string;
  };
}
