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
  | { type: ActionType.TYPINGINSERT; payload: string | null }
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
   * If falsy or no argument is supplied, skip the current character.
   */
  insertTyping: (char?: string | null) => void;
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
    skipCurrentWordOnSpace,
    pauseOnError,
  } = state;
  const payload = action.payload ?? null;
  switch (action.type) {
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
    case ActionType.END: {
      return { ...state, phase: 2, endTime: new Date().getTime() };
    }
    case ActionType.TYPINGINSERT: {
      const letter = action.payload ?? null;
      let newStartTime = startTime;
      let newEndTime = endTime;
      if (phase === 2) {
        return state;
      }

      if (phase === 0) {
        phase = 1;
        newStartTime = new Date().getTime();
      }

      const newCharsState = [...charsState];
      if (
        letter === ' ' &&
        chars[currIndex + 1] !== ' ' &&
        skipCurrentWordOnSpace
      ) {
        const newIndex = chars.indexOf(letter, currIndex);
        currIndex = newIndex === -1 ? length - 1 : newIndex;
      } else {
        if (letter !== null) {
          if (chars[currIndex + 1] !== letter) {
            newCharsState[currIndex + 1] = 2;
            errorChar += 1;
            if (!pauseOnError) {
              currIndex += 1;
            }
          } else {
            newCharsState[currIndex + 1] = 1;
            correctChar += 1;
            currIndex += 1;
          }
        } else {
          currIndex += 1;
        }
      }

      if (currIndex >= length - 1) {
        newEndTime = new Date().getTime();
        phase = 2;
      }
      const currChar = currIndex >= 0 ? chars[currIndex] : '';
      return {
        ...state,
        charsState: newCharsState,
        errorChar,
        correctChar,
        currIndex,
        currChar,
        phase,
        startTime: newStartTime,
        endTime: newEndTime,
      };
    }
    case ActionType.TYPINGDELETE: {
      if (phase !== 1 || currIndex === -1) {
        return state;
      }
      const newCharsState = [...charsState];
      if (payload) {
        let newIndex = chars.lastIndexOf(' ', currIndex);
        newIndex = newIndex === -1 ? 0 : newIndex + 1;
        for (let i = currIndex; i >= newIndex; i--) {
          if (newCharsState[i] === 1) {
            correctChar -= 1;
          } else if (newCharsState[i] === 2) {
            errorChar -= 1;
          }
          newCharsState[i] = 0;
        }
        currIndex = newIndex;
      } else {
        if (newCharsState[currIndex] === 1) {
          correctChar -= 1;
        } else if (newCharsState[currIndex] === 2) {
          errorChar -= 1;
        }
        newCharsState[currIndex] = 0;
      }
      if (currIndex !== -1) {
        currIndex -= 1;
      }
      const currChar = currIndex >= 0 ? chars[currIndex] : '';
      return {
        ...state,
        currIndex,
        currChar,
        charsState: newCharsState,
        correctChar,
        errorChar,
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
      insertTyping: (letter = null) => {
        dispatch({
          type: ActionType.TYPINGINSERT,
          payload: letter ? letter[0] : null,
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
