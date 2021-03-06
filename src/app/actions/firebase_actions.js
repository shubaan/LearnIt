import FireBaseTools from '../utils/firebase';
import {
  LOGIN_WITH_PROVIDER_FIREBASE,
  REGISTER_FIREBASE_USER,
  LOGIN_FIREBASE_USER,
  FETCH_FIREBASE_USER,
  FETCH_FIREBASE_PROFILES,
  UPDATE_FIREBASE_USER,
  CHANGE_FIREBASE_USER_PASSWORD,
  FIREBASE_PASSWORD_RESET_EMAIL,
  LOGOUT_FIREBASE_USER,
  FETCH_FIREBASE_USER_BIO,
  SAVE_FIREBASE_USER_BIO,
  FETCH_FIREBASE_TUTOR_INFO,
  SAVE_FIREBASE_TUTOR_INFO,
  FETCH_FIREBASE_IS_TUTOR,
  SAVE_FIREBASE_IS_TUTOR,
  FETCH_MESSAGES,
  SEND_MESSAGE,
  FETCH_NEW_NOTIFICATION_NUMBER,
  FETCH_NOTIFICATIONS,
  SEND_NOTIFICATION,
  FETCH_SESSIONS
} from './types';


export function loginWithProvider(provider) {
  const request = FireBaseTools.loginWithProvider(provider);
  return {
    type: LOGIN_WITH_PROVIDER_FIREBASE,
    payload: request
  }
}

export function registerUser(user) {
  const request = FireBaseTools.registerUser(user);
  return {
    type: REGISTER_FIREBASE_USER,
    payload: request
  }
}

export function loginUser(user) {
  const request = FireBaseTools.loginUser(user);
  return {
    type: LOGIN_FIREBASE_USER,
    payload: request
  }
}

export function fetchUser() {
  const request = FireBaseTools.fetchUser();
  return {
    type: FETCH_FIREBASE_USER,
    payload: request
  }
}

export function fetchProfiles() {
  const request = FireBaseTools.fetchProfiles();
  return {
    type: FETCH_FIREBASE_PROFILES,
    payload: request
  }
}

export function updateUser(user) {
  const request = FireBaseTools.updateUserProfile(user);
  return {
    type: UPDATE_FIREBASE_USER,
    payload: request
  }
}

export function changePassword(newPassword) {
  const request = FireBaseTools.changePassword(newPassword);
  return {
    type: CHANGE_FIREBASE_USER_PASSWORD,
    payload: request
  }
}

export function resetPasswordEmail(email) {
  const request = FireBaseTools.resetPasswordEmail(email);
  return {
    type: FIREBASE_PASSWORD_RESET_EMAIL,
    payload: request
  }
}

export function logoutUser(user) {
  const request = FireBaseTools.logoutUser(user);
  return {
    type: LOGOUT_FIREBASE_USER,
    payload: request
  }
}

export function fetchBio() {
  const request = FireBaseTools.fetchBio();
  return {
    type: FETCH_FIREBASE_USER_BIO,
    payload: request
  }
}

export function saveBio(bio) {
  const request = FireBaseTools.saveBio(bio);
  return {
    type: SAVE_FIREBASE_USER_BIO,
    payload: request
  }
}

export function fetchTutorInfo() {
  const request = FireBaseTools.fetchTutorInfo();
  return {
    type: FETCH_FIREBASE_TUTOR_INFO,
    payload: request
  }
}

export function saveTutorInfo(tutorInfo) {
  const request = FireBaseTools.saveTutorInfo(tutorInfo);
  return {
    type: SAVE_FIREBASE_TUTOR_INFO,
    payload: request
  }
}

export function fetchIsTutor() {
  const request = FireBaseTools.fetchIsTutor();
  return {
    type: FETCH_FIREBASE_IS_TUTOR,
    payload: request
  }
}

export function saveIsTutor(isTutor) {
  const request = FireBaseTools.saveIsTutor(isTutor);
  return {
    type: SAVE_FIREBASE_IS_TUTOR,
    payload: request
  }
}

export function fetchMessages(uid) {
  const request = FireBaseTools.fetchMessages(uid);
  return {
    type: FETCH_MESSAGES,
    payload: request
  }
}

export function sendMessage(uid, message) {
  const request = FireBaseTools.sendMessage(uid, message);
  return {
    type: SEND_MESSAGE,
    payload: request
  }
}

export function fetchNewNotificationNumber() {
  const request = FireBaseTools.fetchNewNotificationNumber();
  return {
    type: FETCH_NEW_NOTIFICATION_NUMBER,
    payload: request
  }
}

export function fetchNotifications() {
  const request = FireBaseTools.fetchNotifications();
  return {
    type: FETCH_NOTIFICATIONS,
    payload: request
  }
}

export function sendNotification(recipient, message) {
  const request = FireBaseTools.sendNotification(recipient, message);
  return {
    type: SEND_NOTIFICATION,
    payload: request
  }
}

export function fetchSessions() {
  const request = FireBaseTools.fetchSessions();
  return {
    type: FETCH_SESSIONS,
    payload: request
  }
}
