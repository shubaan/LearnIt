import { combineReducers } from 'redux';
import FirebaseUserReducer from './firebase_user_reducer';
import FirebaseProfilesReducer from './firebase_profiles_reducer';

const rootReducer = combineReducers({
    currentUser: FirebaseUserReducer,
    profiles: FirebaseProfilesReducer
});

export default rootReducer;
