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
          //console.log("first time login")
          let defaultBio = "I am an awesome person";
          let defaultPhoto = "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png";
          let profileData = {
            name: "anonymous",
            isTutor: false,
            bio: defaultBio,
            photoUrl:defaultPhoto,
            tutorInfo: {
              availability: {
                weekly: '0',
                exceptions: '0',
                appointments: '0'
              },
              math: false,
              science: false,
              english: false,
              spanish: false,
              history: false,
              resume: 'link',
              payrate: 0,
              rating: 0,
              reviews: {}
            }
          };
          user.providerData.forEach(function (profile) {
            profileData.name = profile.displayName;
            profileData.photoUrl = profile.photoURL;
          });
          firebaseDb.ref('/profiles/' + firebaseAuth.currentUser.uid).set(profileData);
        } else {
          //console.log(profile);
          //user.profile = profile;
          var profileData = {
            name: user.displayName,
            photoUrl: user.photoURL
          };
          user.providerData.forEach(function (profile) {
            profileData.name = profile.displayName;
            profileData.photoUrl = profile.photoURL;
          });
          firebaseDb.ref('/profiles/' + firebaseAuth.currentUser.uid).update(profileData);
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
      photoUrl: "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png",
      tutorInfo: {
        availability: {
          weekly: '0',
          exceptions: '0',
          appointments: '0'
        },
        math: false,
        science: false,
        english: false,
        spanish: false,
        history: false,
        resume: 'link',
        payrate: 0,
        rating: 0,
        reviews: {}
      }
    };
    if (user.isTutor) {
      profileData.tutorInfo.math = user.math;
      profileData.tutorInfo.science = user.science;
      profileData.tutorInfo.english = user.english;
      profileData.tutorInfo.spanish = user.spanish;
      profileData.tutorInfo.history = user.history;
      profileData.tutorInfo.payrate = user.payrate;
    }
    //console.log(user);
    return firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(user => {
      user.updateProfile({
        displayName: profileData.name,
        photoURL: profileData.photoUrl
      }).then(function() {
        //console.log("profile updated");
      }, function(error) {
        //console.log("authentication profile failed to be updated");
      });
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
    //console.log("attempting logout...");
    return firebaseAuth.signOut().then(() => {
      //console.log("logged out");
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
    /*return new Promise((resolve, reject) => {
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
    })*/
    return new Promise((resolve, reject) => {
      const unsub = firebaseAuth.onAuthStateChanged(user => {
        unsub();
        resolve(user);
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
    //console.log("attempting login...");
    return firebaseAuth.signInWithEmailAndPassword(user.email, user.password).then(user => {
      /*firebaseDb.ref('/').child('profiles/'+user.uid).on("value", function(snapshot){
        let profile = snapshot.val();
        //console.log("print profile now")
        //console.log(profile);
        user.profile = profile
      })*/
      //console.log("user logged in: "+user);
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
    var user = firebaseAuth.currentUser;
    if (!user.photoURL && !u.photoURL) {
      //console.log("setting new photoUrl");
      u.photoURL = "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png";
    }
    return user.updateProfile(u).then(() => {
      let newName = (u.displayName)? u.displayName : user.displayName;
      let newPhoto = (u.photoURL)? u.photoURL : user.photoURL;
      //console.log("name to update: "+newName);
      //console.log("photoURL to update: "+newPhoto);
      firebaseDb.ref('/profiles/' + user.uid).update({name: newName, photoUrl: newPhoto});
      return user;
    }, error => {
      return {
        errorCode: error.code,
        errorMessage: error.message
      }
    })
    /*firebaseDb.ref('/profiles/' + u.uid).set(u.profile);
    return u;*/
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
          //console.log('New info Submitted');
        }
      };
      //save tutorInfo
      firebaseDb.ref('/profiles/' + user.uid).child('tutorInfo').update(tutorInfo, onComplete);
    } else {
      //console.log('User is not signed in');
    }

    return tutorInfo;
  },

  /**
   * Fetch isTutor
   *
   * @returns {Promise}
   */
  fetchIsTutor: () => {
    return new Promise((resolve, reject) => {
      var user = firebaseAuth.currentUser;
      if (user) {
        //console.log('User is signed in');
        firebaseDb.ref('/profiles/' + user.uid).child('isTutor').on("value", function(snapshot){
          let isTutor = snapshot.val();
          //console.log(isTutor);
          resolve(isTutor);
        });
      } else {
        //console.log('User is not signed in');
      }
    }, error => {
      reject(error);
    })
  },

  /**
   * Save isTutor
   -
   * @param isTutor
   * @returns isTutor
   */
  saveIsTutor: (isTutor) => {
    var user = firebaseAuth.currentUser;
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
        } else {
          //console.log('New info Submitted');
        }
      };
      //save isTutor
      firebaseDb.ref('/profiles/' + user.uid).child('isTutor').set(isTutor, onComplete);
    } else {
      //console.log('User is not signed in');
    }

    return isTutor;
  },

    /**
     * Fetch messages
     *
     * @returns {Promise}
     */
    fetchMessages: (pid) => {
      return new Promise((resolve, reject) => {
        let messagePath = 'messages/' + firebaseAuth.currentUser.uid + '/' + pid + '/'
        let messagesRef = firebaseDb.ref('/').child(messagePath);
        messagesRef.on("value", function(snapshot) {
          let messages = snapshot.val();
          console.log(messages)
          resolve(messages);
        });
      }, error => {
        reject(error);
      })
    },

    /**
     * Fetch messages
     *
     * @returns {Promise}
     */
    fetchMyMessages: (pid, callback) => {
      let messagePath = 'messages/' + firebaseAuth.currentUser.uid + '/' + pid + '/'
      let messagesRef = firebaseDb.ref('/').child(messagePath);
      messagesRef.on("child_added", function(snapshot) {
        let message = snapshot.val().text;
        let time = snapshot.key;
        callback(message, time);
      });

    },

    /**
     * Fetch messages in realtime
     *
     * @returns {Promise}
     */
    fetchTheirMessages: (pid, callback) => {
      let messagePath = 'messages/' + pid + '/' + firebaseAuth.currentUser.uid + '/'
      console.log(messagePath)
      let messagesRef = firebaseDb.ref('/').child(messagePath);
      messagesRef.on("child_added", function(snapshot) {
        let message = snapshot.val().text;
        let time = snapshot.key;
        callback(message, time)
      });
    },

      /**
       * send messge
       *
       * @returns {Promise}
       */
      sendMessage: (pid, message) => {
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        let messageData = {
          text: message
        }
        let messagePath = 'messages/' + firebaseAuth.currentUser.uid + '/' + pid + '/'
        firebaseDb.ref('/')
        .child(messagePath + Date.now())
        .set(messageData);
      },
};

export default FireBaseTools;
