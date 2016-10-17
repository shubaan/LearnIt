import { combineReducers } from 'redux';
import FirebaseUserReducer from './firebase_user_reducer';
import FirebaseProfilesReducer from './firebase_profiles_reducer';
import FirebaseBioReducer from './firebase_bio_reducer';

const rootReducer = combineReducers({
    currentUser: FirebaseUserReducer,
    profiles: FirebaseProfilesReducer,
    bio: FirebaseBioReducer
});

export default rootReducer;
