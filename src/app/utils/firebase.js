import firebase from 'firebase';
import {FIREBASE_CONFIG} from '../config';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

var FireBaseTools = {

  /**
   * Return an instance of a firebase auth provider based on the provider string.
   *
   * @param provider
   * @returns {firebase.auth.AuthProvider}
   */
  getProvider: (provider) => {
    switch (provider) {
      case "email":
        return new firebase.auth.EmailAuthProvider();
      case "facebook":
        return new firebase.auth.FacebookAuthProvider();
      case "github":
        return new firebase.auth.GithubAuthProvider();
      case "google":
        return new firebase.auth.GoogleAuthProvider();
      case "twitter":
        return new firebase.auth.TwitterAuthProvider();
      default:
    }
  },

  /**
   * Login with provider => p is provider "email", "facebook", "github", "google", or "twitter"
   * Uses Popup therefore provider must be an OAuth provider. EmailAuthProvider will throw an error
   *
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
  loginWithProvider: (p) => {
    let provider = FireBaseTools.getProvider(p);
    return firebaseAuth.signInWithPopup(provider).then(function (result) {
      let user = firebaseAuth.currentUser;
      firebaseDb.ref('/').child('profiles/'+firebaseAuth.currentUser.uid).on("value", function(snapshot){
        let profile = snapshot.val();
        if (profile == null) {
          console.log("first time login")
          let defaultBio = "I am an awesome person";
          let defaultPhoto = "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png";
          let profileData = {
            name: "anonymous",
            isTutor: false,
            bio: defaultBio,
            photoUrl:defaultPhoto,
          };
          user.providerData.forEach(function (profile) {
            profileData.name = profile.displayName;
            profileData.photoUrl = profile.photoURL;
          });
          firebaseDb.ref('/profiles/' + firebaseAuth.currentUser.uid).set(profileData);
        } else {
          console.log(profile);
          user.profile = profile;
        }
      });
      return user;
    }).catch(function (error) {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Register a user with email and password
   *-bio
   -hourly rate
   -availability
   -
   * @param user
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
  registerUser: (user) => {
    let defaultBio = "I am an awesome " + ((user.isTutor)? "tutor" : "student");
    let profileData = {
      name: user.name,
      isTutor: user.isTutor,
      bio: defaultBio,
      photoUrl: "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png"
    };
    if (user.isTutor) {
      profileData.math = user.math;
      profileData.science = user.science;
      profileData.english = user.english;
      profileData.spanish = user.spanish;
      profileData.history = user.history;
      profileData.payrate = user.payrate;
    }
    console.log(user);
    return firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(user => {
      firebaseDb.ref('/profiles/' + user.uid).set(profileData);
      return user;
    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },


  /**
   * Sign the user out
   *
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  logoutUser: () => {
    return firebaseAuth.signOut().then(() => {
      return {
        success: 1,
        message: "logout"
      };
    });
  },

  /**
   * Retrieve the current user (Promise)
   * @returns {Promise}
   */
  fetchUser: () => {
    return new Promise((resolve, reject) => {
      const unsub = firebaseAuth.onAuthStateChanged(user => {
        if (!user) {
          return
        }
        firebaseDb.ref('/').child('profiles/'+user.uid).on("value", function(snapshot){
          let profile = snapshot.val();
          //console.log("print profile now")
          console.log(profile);
          user.profile = profile
          unsub();
          resolve(user);
        });
      }, error => {
        reject(error);
      })
    })
  },

  /**
   * Fetch all user profiles
   *
   * @returns {Promise}
   */
  fetchProfiles: () => {
    return new Promise((resolve, reject) => {
      let profilesRef =firebaseDb.ref('/').child('profiles');
      profilesRef.on("value", function(snapshot){
        let profiles = snapshot.val();
        // log all profile names
        for (var p in profiles){
          //console.log(profiles[p]);
          //console.log(p);
        }
        resolve(profiles);
      });
    }, error => {
      reject(error);
    })
  },

  /**
   * Log the user in using email and password
   *
   * @param user
   * @returns {any|!firebase.Thenable.<*>|firebase.Thenable<any>}
   */
  loginUser: (user) => {
    return firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(user => {
      firebaseDb.ref('/').child('profiles/'+user.uid).on("value", function(snapshot){
        let profile = snapshot.val();
        //console.log("print profile now")
        console.log(profile);
        user.profile = profile
      })
      return user;
    }).catch(error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Update a user's profile data
   *
   * @param u
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  updateUserProfile: (u) => {
    firebaseDb.ref('/profiles/' + u.uid).set(u.profile);
    return u;
  },

  /**
   * Reset the password given the specified email
   *
   * @param email {string}
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  resetPasswordEmail: (email) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(() => {
      return {
        message: 'Email sent'
      }
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Update the user's password with the given password
   *
   * @param newPassword {string}
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  changePassword: (newPassword) => {
    return firebaseAuth.currentUser.updatePassword(newPassword).then(user => {
      return user;
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Send an account email verification message for the currently logged in user
   *
   * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>|!firebase.Thenable.<*>}
   */
  sendEmailVerification: () => {
    return firebaseAuth.currentUser.sendEmailVerification().then(() => {
      return {
        message: 'Email sent'
      }
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    });
  },

  /**
   * Get the firebase database reference.
   *
   * @param path {!string|string}
   * @returns {!firebase.database.Reference|firebase.database.Reference}
   */
  getDatabaseReference: (path) => {
    return firebaseDb.ref(path);
  },

  /**
   * Fetch biography info
   *
   * @returns {Promise}
   */
  fetchBio: () => {
    return new Promise((resolve, reject) => {
      var user = firebaseAuth.currentUser;
      if (user) {
        //console.log('User is signed in');
        firebaseDb.ref('/profiles/' + user.uid).child('bio').on("value", function(snapshot){
          let bio = snapshot.val();
          //console.log(bio);
          resolve(bio);
        });
      } else {
        //console.log('User is not signed in');
      }
    }, error => {
      reject(error);
    })
  },

  /**
   * Save biography info
   -
   * @param biography
   * @returns biography
   */
  saveBio: (biography) => {
    var user = firebaseAuth.currentUser;
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
        } else {
          //console.log('New Bio Submitted');
        }
      };
      //save bio
      firebaseDb.ref('/profiles/' + user.uid).child('bio').set(biography, onComplete);
    } else {
      //console.log('User is not signed in');
    }

    return biography;
    //firebaseDb.ref('/profiles/' + user.uid).set(profileData);
    //fredNameRef.set({ first: 'Fred', last: 'Flintstone' }, onComplete);
  },

  /**
   * Fetch tutor info
   *
   * @returns {Promise}
   */
  fetchTutorInfo: () => {
    return new Promise((resolve, reject) => {
      var user = firebaseAuth.currentUser;
      if (user) {
        //console.log('User is signed in');
        firebaseDb.ref('/profiles/' + user.uid).child('tutorInfo').on("value", function(snapshot){
          let tutorInfo = snapshot.val();
          //console.log(tutorInfo);
          resolve(tutorInfo);
        });
      } else {
        //console.log('User is not signed in');
      }
    }, error => {
      reject(error);
    })
  },

  /**
   * Save tutor info
   -
   * @param tutorInfo
   * @returns tutorInfo
   */
  saveTutorInfo: (tutorInfo) => {
    var user = firebaseAuth.currentUser;
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
        } else {
          //console.log('New Bio Submitted');
        }
      };
      //save bio
      firebaseDb.ref('/profiles/' + user.uid).child('tutorInfo').set(tutorInfo, onComplete);
    } else {
      //console.log('User is not signed in');
    }

    return tutorInfo;
  }
};

export default FireBaseTools;
