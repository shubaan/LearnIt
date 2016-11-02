import {
  FETCH_FIREBASE_IS_TUTOR,
  SAVE_FIREBASE_IS_TUTOR
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_FIREBASE_IS_TUTOR:
      return action.payload;
    case SAVE_FIREBASE_IS_TUTOR:
      return action.payload;
  }
  return state;
}
