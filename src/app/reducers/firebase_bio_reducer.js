import {
  FETCH_FIREBASE_USER_BIO,
  SAVE_FIREBASE_USER_BIO
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_FIREBASE_USER_BIO:
      return action.payload;
    case SAVE_FIREBASE_USER_BIO:
      return action.payload;
  }
  return state;
}
