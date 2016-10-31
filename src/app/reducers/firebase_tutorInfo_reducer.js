import {
  FETCH_FIREBASE_TUTOR_INFO,
  SAVE_FIREBASE_TUTOR_INFO
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_FIREBASE_TUTOR_INFO:
      return action.payload;
    case SAVE_FIREBASE_TUTOR_INFO:
      return action.payload;
  }
  return state;
}
