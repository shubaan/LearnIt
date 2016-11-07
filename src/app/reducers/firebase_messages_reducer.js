import {
  FETCH_MESSAGES,
  SEND_MESSAGE
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {
    case FETCH_MESSAGES:
      return action.payload;
  }
  return state;
}
