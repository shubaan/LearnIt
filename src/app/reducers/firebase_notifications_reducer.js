import {
  FETCH_NOTIFICATIONS
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return action.payload;
  }
  return state;
}
