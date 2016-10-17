import {
  FETCH_FIREBASE_PROFILES,
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_FIREBASE_PROFILES:
      return action.payload;
  }
  return state;
}
