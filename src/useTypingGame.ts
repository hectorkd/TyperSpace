// https://www.npmjs.com/package/react-typing-game-hook
// going to modify this typing hook for our game

import { Reducer, useReducer } from 'react';

enum ActionType {
  RESET = 'RESET',
  END = 'END',
  TYPINGINSERT = 'TYPING/INSERT',
  TYPINGDELETE = 'TYPING/DELETE',
  SETCURRENTINDEX = 'SET/CURRENTINDEX',
}

type ActionItemType =
  | { type: ActionType.RESET; payload?: undefined }
  | { type: ActionType.END; payload?: undefined }
  | { type: ActionType.TYPINGDELETE; payload: boolean }
  | {
      type: ActionType.TYPINGINSERT;
      payload: string | null;
      start: number | null;
    }
  | { type: ActionType.SETCURRENTINDEX; payload: number };

/**
 * Represent the state of each character in the string.
 * `0` represents incomplete, `1` represents correct and, `2` represents incorrect.
 */
type CharStateType = 0 | 1 | 2;
interface TypingOptionsType {
  /**
   * Move on to the next word when space is inputted, defaults to `true`.
   */
  skipCurrentWordOnSpace: boolean;
  /**
   * Stay on the current index when the inputted character is wrong, defaults to `false`.
   */
  pauseOnError: boolean;
}

/**
 * Properties of the typing game hook.
 */
interface TypingStateType extends TypingOptionsType {
  /**
   * The inputted string to be used.
   */
  chars: string;
  /**
   * Array of each character's state in the string.
   */
  charsState: CharStateType[];
  /**
   * Length of the string used.
   */
  length: number;
  /**
   * Current index of the character the user have typed till.
   */
  currIndex: number;
  /**
   * Current character the user have typed till.
   */
  currChar: string;
  /**
   * Number of correct character the user had typed.
   */
  correctChar: number;
  /**
   * Number of incorrect character the user had typed.
   */
  errorChar: number;
  /**
   * Represent the current state.
   * `0` typing haven't started, `1` typing started, `2` typing ended.
   */
  phase: 0 | 1 | 2;
  /**
   * Time in milliseconds when the typing started
   */
  startTime: number | null;
  /**
   * Time in milliseconds when the typing ended
   */
  endTime: number | null;
  /**
   *  Total number of key presses
   */
  allKeyPresses: number;
  hasError: boolean;
}

/**
 * Methods of the typing game hook.
 */
type TypingActionType = {
  /**
   * Duration in milliseconds since the typing started.
   * 0 if the typing has yet to start.
   * When the typing ended, the duration will be equivalent to endTime - startTime.
   */
  getDuration: () => number;
  /**
   * Reset the typing sequence.
   */
  resetTyping: () => void;
  /**
   * Ends the typing sequence but not reset it.
   */
  endTyping: () => void;
  /**
   * Insert a character into the current typing sequence.
   * @param {string | null} char A character to be inserted.
   * @param {number | null} start StartTime received from the server
   * If falsy or no argument is supplied, skip the current character.
   */
  insertTyping: (char?: string | null, start?: number | null) => void;
  /**
   * Delete a character from the current typing sequence.
   * @param {boolean} [deleteWord] If `true`, deletes the whole of the current word. Defaults to `false`.
   */
  deleteTyping: (deleteWord?: boolean) => void;
  /**
   * Set the current index manually.
   * @param {number} num Allows from -1 to length - 1 of the text, numbers that falls outside of the range will return a false.
   */
  setCurrIndex: (num: number) => boolean;
};

const reducer: Reducer<TypingStateType, ActionItemType> = (state, action) => {
  const {
    startTime,
    endTime,
    chars,
    charsState,
    length,
    currIndex,
    correctChar,
    errorChar,
    phase,
    allKeyPresses,
    // skipCurrentWordOnSpace,
    pauseOnError,
    hasError,
  } = state;
  const payload = action.payload ?? null;
  switch (action.type) {
    //setcurrentindex action
    case ActionType.SETCURRENTINDEX: {
      if (
        payload &&
        typeof payload === 'number' &&
        payload >= -1 &&
        payload < length
      ) {
        return { ...state, currIndex: payload, currChar: chars[payload] };
      } else {
        return state;
      }
    }

    // reset action
    case ActionType.RESET: {
      return {
        ...state,
        startTime: null,
        endTime: null,
        charsState: new Array(chars.length).fill(0),
        currIndex: -1,
        currChar: '',
        correctChar: 0,
        errorChar: 0,
        phase: 0,
      };
    }

    //end action
    case ActionType.END: {
      return { ...state, phase: 2, endTime: new Date().getTime() };
    }

    //insert character action
    case ActionType.TYPINGINSERT: {
      const letter = action.payload ?? null;
      const startGame = action.start ?? null;
      let newStartTime = startTime;
      let newEndTime = endTime;
      let newPhase = phase;
      let newErrorChar = errorChar;
      let newCurrIndex = currIndex;
      let newCorrectChar = correctChar;
      let newHasError = hasError;

      const errorIndex = charsState.indexOf(2);
      console.log('insert wrong letter with index', errorIndex);
      if (errorIndex !== -1 && currIndex - errorIndex >= 4) {
        console.log('errorIndex again', errorIndex);
        console.log(
          'currentIndex',
          currIndex,
          'errorIndex',
          errorIndex,
          'indexes between error and current',
          currIndex - errorIndex,
        );
        newHasError = true;
      }

      // if phase is 2 -> game is finished, state is the same
      if (phase === 2) {
        return state;
      }

      // if phase is 0 -> start game
      if (phase === 0) {
        // phase = 1;
        newPhase = 1;
        // newStartTime = new Date().getTime();
        newStartTime = startGame; // startTime is coming from server
      }

      // last case: phase = 1 -> insert character
      const newCharsState = [...charsState];
      //first if checks if letter is space AND skipCurrentWordOnSpace mode -> goes to the next word; don't need it in our game
      // if (
      //   letter === ' ' &&
      //   chars[currIndex + 1] !== ' '
      //   // skipCurrentWordOnSpace
      // ) {
      //   const newIndex = chars.indexOf(letter, currIndex);
      //   // currIndex = newIndex === -1 ? length - 1 : newIndex;
      //   const newCurrIndex = newIndex === -1 ? length - 1 : newIndex;
      // } else {

      if (letter !== null) {
        if (!hasError) {
          if (chars[currIndex + 1] !== letter) {
            //checks if inserted character is correct
            newCharsState[currIndex + 1] = 2; //set character state to error (2)
            newErrorChar += 1; // increase number of wrong letters
            // if (!pauseOnError) {
            newCurrIndex += 1; //go to next letter
            // }
          } else {
            newCharsState[currIndex + 1] = 1; //set character state to correct(1)
            newCorrectChar += 1; //increase number of correct letters
            newCurrIndex += 1; // go to next letter
          }
        }
      }

      // } else {
      //   // if letter is null just go to next letter
      //   newCurrIndex += 1;
      // }

      // const errorIndex = charsState.indexOf(2);
      // console.log('insert wrong letter with index', errorIndex);
      // if (errorIndex !== -1 && currIndex - errorIndex < 2) {
      //   console.log('errorIndex again', errorIndex);
      //   newHasError = true;
      // }

      // newCurrIndex += 1;
      // if (currIndex === length - 2 && !charsState.some((el) => el === 2)) {
      if (currIndex === length - 2 && !newCharsState.some((el) => el === 2)) {
        // if text is finished
        newEndTime = Date.now(); //set finishtime
        newPhase = 2; // set finish state
      }
      const currChar = currIndex >= 0 ? chars[currIndex] : ''; //go to next letter
      const newAllKeyPresses = allKeyPresses + 1;
      return {
        ...state,
        charsState: newCharsState,
        errorChar: newErrorChar,
        correctChar: newCorrectChar,
        currIndex: newCurrIndex,
        currChar,
        phase: newPhase,
        startTime: newStartTime,
        endTime: newEndTime,
        allKeyPresses: newAllKeyPresses,
        hasError: newHasError,
      };
    }

    //delete character action
    case ActionType.TYPINGDELETE: {
      let newCorrectChar = correctChar;
      let newErrorChar = errorChar;
      let newCurrIndex = currIndex;
      let newHasError = hasError;
      console.log('starting deleting...');

      // const errorIndex = charsState.indexOf(2);
      // if (errorIndex === -1) {
      //   console.log('inside deleting, errorIndex=', errorIndex);
      //   newHasError = false;
      // }

      if (phase !== 1 || currIndex === -1) {
        console.log('checking game phase.....');
        //game is finished or never started, no changes for state
        return state;
      }

      const newCharsState = [...charsState];

      if (payload) {
        console.log('payload is true!');
        let newIndex = chars.lastIndexOf(' ', currIndex);
        newIndex = newIndex === -1 ? 0 : newIndex + 1;
        for (let i = currIndex; i >= newIndex; i--) {
          if (newCharsState[i] === 1) {
            newCorrectChar -= 1;
          } else if (newCharsState[i] === 2) {
            newErrorChar -= 1;
          }
          newCharsState[i] = 0;
        }
        newCurrIndex = newIndex;
      } else {
        console.log('payload is false!!!!');
        if (newCharsState[currIndex] === 1) {
          console.log('letter was correct');
          newCorrectChar -= 1;
        } else if (newCharsState[currIndex] === 2) {
          console.log('letter was incorrect');
          newErrorChar -= 1;
        }
        newCharsState[currIndex] = 0;
      }
      if (currIndex !== -1) {
        newCurrIndex -= 1;
      }
      const currChar = currIndex >= 0 ? chars[currIndex] : '';

      const errorIndex = newCharsState.indexOf(2);
      if (errorIndex === -1) {
        console.log('inside deleting, errorIndex=', errorIndex);
        newHasError = false;
      }

      return {
        ...state,
        currIndex: newCurrIndex,
        currChar,
        charsState: newCharsState,
        correctChar: newCorrectChar,
        errorChar: newErrorChar,
        hasError: newHasError,
      };
    }
    default: {
      return state;
    }
  }
};

/**
 * React hook to create typing game/practice/test.
 * @param {string} text A string of words to be used for the typing sequence.
 * @param {Object} [options] Addition options to customize the functionality of the typing sequence.
 * @param {boolean} [options.skipCurrentWordOnSpace] Move on to the next word when space is inputted, defaults to `true`
 * @param {boolean} [options.pauseOnError] Stay on the current index when the inputted character is wrong, defaults to `false`
 * @returns Returns the state and the actions available for the typing hook
 */
const useTypingGame = (
  text: string,
  options: Partial<TypingOptionsType> = {},
): { states: TypingStateType; actions: TypingActionType } => {
  const initialState: TypingStateType = {
    startTime: null,
    endTime: null,
    chars: text,
    charsState: new Array(text.length).fill(0),
    length: text.length,
    currIndex: -1,
    currChar: '',
    correctChar: 0,
    errorChar: 0,
    phase: 0,
    skipCurrentWordOnSpace: true,
    pauseOnError: false,
    allKeyPresses: 0,
    hasError: false,
    ...options,
  };

  const [states, dispatch] = useReducer<
    Reducer<TypingStateType, ActionItemType>
  >(reducer, initialState);

  return {
    states,
    actions: {
      getDuration: () => {
        switch (states.phase) {
          case 0: {
            return 0;
          }
          case 1: {
            return states.startTime
              ? new Date().getTime() - states.startTime
              : 0;
          }
          case 2: {
            return states.startTime && states.endTime
              ? states.endTime - states.startTime
              : 0;
          }
        }
      },
      resetTyping: () => dispatch({ type: ActionType.RESET }),
      endTyping: () => dispatch({ type: ActionType.END }),
      insertTyping: (letter = null, start = null) => {
        dispatch({
          type: ActionType.TYPINGINSERT,
          payload: letter ? letter[0] : null,
          start: start ? start : null,
        });
      },
      deleteTyping: (deleteWord = false) => {
        dispatch({
          type: ActionType.TYPINGDELETE,
          payload: deleteWord || false,
        });
      },
      setCurrIndex: (num) => {
        if (num < -1 || num >= states.length || states.phase !== 2) {
          return false;
        }
        dispatch({
          type: ActionType.SETCURRENTINDEX,
          payload: num,
        });
        return true;
      },
    },
  };
};

export default useTypingGame;
