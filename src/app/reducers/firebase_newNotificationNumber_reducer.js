import {
  FETCH_NEW_NOTIFICATION_NUMBER
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_NEW_NOTIFICATION_NUMBER:
      return action.payload;
  }
  return state;
}
