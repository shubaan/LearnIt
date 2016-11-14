import {
  FETCH_SESSIONS
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_SESSIONS:
      return action.payload;
  }
  return state;
}
