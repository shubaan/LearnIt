import { combineReducers } from 'redux';
import FirebaseUserReducer from './firebase_user_reducer';
import FirebaseProfilesReducer from './firebase_profiles_reducer';
import FirebaseBioReducer from './firebase_bio_reducer';
import FirebaseTutorInfoReducer from './firebase_tutorInfo_reducer'
import FirebaseIsTutorReducer from './firebase_isTutor_reducer'
import FirebaseMessagesReducer from './firebase_messages_reducer'
import FirebaseNewNotificationNumberReducer from './firebase_newNotificationNumber_reducer'
import FirebaseNotificationsReducer from './firebase_notifications_reducer'

const rootReducer = combineReducers({
  currentUser: FirebaseUserReducer,
  profiles: FirebaseProfilesReducer,
  bio: FirebaseBioReducer,
  tutorInfo: FirebaseTutorInfoReducer,
  isTutor: FirebaseIsTutorReducer,
  messages: FirebaseMessagesReducer,
  newNotificationNumber: FirebaseNewNotificationNumberReducer,
  notifications: FirebaseNotificationsReducer,
});

export default rootReducer;
