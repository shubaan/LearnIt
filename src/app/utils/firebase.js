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
              math: false,
              science: false,
              english: false,
              spanish: false,
              history: false,
              resume: 'link',
              payrate: 0,
              paypalId: "",
              rating: 0,
              reviews: {}
            }
          };
          user.providerData.forEach(function (profile) {
            profileData.name = profile.displayName;
            profileData.photoUrl = profile.photoURL;
            profileData.tutorInfo.paypalEmail = profile.email;
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
      bio: user.bio,
      photoUrl: "http://www.fringuette.com/wp-content/uploads/2015/01/female-fill-circle-512.png",
      tutorInfo: {
        math: false,
        science: false,
        english: false,
        spanish: false,
        history: false,
        resume: 'link',
        payrate: 0,
        paypalId: user.email,
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
      profileData.tutorInfo.paypalId = user.paypalId;
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

  fetchProfile: (uid, callback) => {
    let profilesRef =firebaseDb.ref('/').child('profiles/'+uid);
    profilesRef.on("value", function(snapshot){
      let profile = snapshot.val();
      callback(profile);
    });
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
    });
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
    fetchMessages: (sid, pid) => {
      return new Promise((resolve, reject) => {
        let messagePath = 'messages/' + sid + "/" + firebaseAuth.currentUser.uid + '/' + pid + '/'
        let messagesRef = firebaseDb.ref('/').child(messagePath);
        messagesRef.on("value", function(snapshot) {
          let messages = snapshot.val();
          //console.log(messages)
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
    fetchMyMessages: (sid, pid, callback) => {
      let messagePath = 'messages/' + sid + "/" + firebaseAuth.currentUser.uid + '/' + pid + '/'
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
    fetchTheirMessages: (sid, pid, callback) => {
      let messagePath = 'messages/' + sid + "/" + pid + '/' + firebaseAuth.currentUser.uid + '/'
      //console.log(messagePath)
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
    sendMessage: (sid, pid, message) => {
      if (!Date.now) {
          Date.now = function() { return new Date().getTime(); }
      }
      let messageData = {
        text: message
      };
      let messagePath = 'messages/' + sid + "/" + firebaseAuth.currentUser.uid + '/' + pid + '/';
      firebaseDb.ref('/').child(messagePath + Date.now()).set(messageData);
    },

    /**
     * save a line path that was drawn on a whiteboard
     *
     * @returns {Promise}
     */
    drawNewLine: (sid, linePath) => {
      if (!Date.now) {
          Date.now = function() { return new Date().getTime(); }
      }
      let whiteBoardPath = 'whiteboards/' + sid + '/lines/'
      // Get a key for a new Post.
      let key = firebaseDb.ref().child(whiteBoardPath).push().key;
      // Save the new line path
      firebaseDb.ref('/')
      .child(whiteBoardPath + key)
      .set(linePath);
    },
    /**
     * Fetch messages in realtime
     *
     * @returns {Promise}
     */
    fetchWhiteBoard: (sid, draw, clear) => {
      let whiteBoardPath = 'whiteboards/' + sid + '/'
      let whiteBoardRef = firebaseDb.ref('/').child(whiteBoardPath + 'lines/');
      whiteBoardRef.on("value", function(snapshot) {
        var linePaths = snapshot.val();
        for (var index in linePaths) {
          let linePath = linePaths[index]
          draw(linePath)
        }
      });
      whiteBoardRef.on("child_added", function(snapshot) {
        var linePath = snapshot.val();
        draw(linePath)
      });
      firebaseDb.ref('/').child(whiteBoardPath).on("child_removed", function(snapshot) {
        clear()
      });
    },
    /**
     * delete whiteboard
     *
     * @returns {Promise}
     */
    deleteWhiteBoard: (sid) => {
      let whiteBoardPath = 'whiteboards/' + sid + '/lines/'
      let whiteBoardRef = firebaseDb.ref('/').child(whiteBoardPath);
      whiteBoardRef.remove()
    },

  /**
   * Fetch new Notification Number
   *
   *
   */
  fetchNewNotificationNumber: (callback) => {
    //console.log('Fetching NewNotificationNumber...');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //console.log('User is signed in');
        firebaseDb.ref('/userData/' + user.uid).child('newNotificationNumber').on("value", function (snapshot) {
          let newNotificationNumber = snapshot.val();
          //console.log('fb newNotificationNumber: ' + newNotificationNumber)
          callback(newNotificationNumber);
        });
      } else {
        //console.log('User is not signed in');
      }
    });
  },

  /**
   * Fetch user notifications
   *
   * @returns {Promise}
   */
  fetchNotifications: () => {
    return new Promise((resolve, reject) => {
      var user = firebaseAuth.currentUser;
      if (user) {
        firebaseDb.ref('/userData/' + user.uid).child('notifications').on("value", function(snapshot){
          //set newNotificationNumber to 0
          var onComplete = function(error) {
            if (error) {
              //console.log('Synchronization failed');
            } else {
              //console.log('New notification number updated');
            }
          };
          firebaseDb.ref('/userData/' + user.uid).child('newNotificationNumber').set(0, onComplete);

          //return notifications
          let notifications = snapshot.val();
          resolve(notifications);
        });
      } else {
        //console.log('User is not signed in');
      }
    }, error => {
      reject(error);
    })
  },

  /**
   * Send a notification
   -
   * @param recipient
   * @param message
   */
  sendNotification: (recipient, message, callback) => {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
    }

    var result = {
      success: false,
      message: ""
    };
    var user = firebaseAuth.currentUser;
    if (user) {

      var notification = {
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        type: "message",
        message: message,
        timestamp: Date.now()
      };

      var onComplete = function(error) {
        if (error) {
          //console.log('Notification sending failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Notification sent');
          result.message = "Message sent";
          result.success = true;
          callback(result);

          //increment new message count
          var ref = firebaseDb.ref('/userData/' + recipient).child('newNotificationNumber');
          ref.transaction(function (current_value) {
              return (current_value || 0) + 1;
            }, function(error) {
              if (error) {
                //console.log('Incrementing new notification count failed');
              } else {
                //console.log('New notification count incremented');
              }
            }
          );

        }
      };

      var newMessageRef = firebaseDb.ref('/userData/' + recipient).child('notifications').push();
      newMessageRef.set(notification, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Fetch session
   *
   * @returns {Promise}
   */
  fetchSession: (sid, callback) => {
    //console.log(sid);
    firebaseDb.ref('/sessions/').child(sid).on("value", function(snapshot){
      let session = snapshot.val();
      callback(session);
    });
  },

  /**
   * Fetch session ids of current user
   *
   * @returns {Promise}
   */
  fetchSessions: () => {
    return new Promise((resolve, reject) => {
      var user = firebaseAuth.currentUser;
      if (user) {
        //console.log('User is signed in');
        firebaseDb.ref('/userData/' + user.uid).child('sessions').on("value", function(snapshot){
          let sessions = snapshot.val();
          resolve(sessions);
        });
      } else {
        //console.log('User is not signed in');
      }
    }, error => {
      reject(error);
    })
  },
    /**
     * Fetch session ids of current user
     *
     */
    fetchMySessions: (callback) => {
      var user = firebaseAuth.currentUser;
      if (user) {
        //console.log('User is signed in');
        firebaseDb.ref('/userData/' + user.uid).child('sessions').on("value", function(snapshot){
          let sids = snapshot.val();
          for (var sid in sids) {
            firebaseDb.ref('/sessions/').child(sids[sid]).on("value", function(snapshot){
              var session = snapshot.val();
              session.sid = snapshot.key;
              //console.log(session.description+" "+snapshot.key);
              callback(session)
            });
          }
        });
      } else {
        //console.log('User is not signed in');
      }
    },

  /**
   * Request a new tutoring session
   *
   */
  requestSession: (tutor, subject, description, from, to, callback) => {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
    }

    var result = {
      success: false,
      message: ""
    };
    var user = firebaseAuth.currentUser;
    if (user) {
      var session = {
        studentId: user.uid,
        tutorId: tutor,
        startTime: from,
        endTime: to,
        subject: subject,
        description: description,
        paymentStatus: "unpaid",
        status: "pending"
      };

      var newSessionRef = firebaseDb.ref('/').child('sessions').push();
      var sessionId = newSessionRef.key;

      var request = {
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        type: "request",
        message: user.displayName+" is requesting a tutoring session",
        timestamp: Date.now(),
        request: {
          startTime: from,
          endTime: to,
          subject: subject,
          description: description,
          sessionId: sessionId,
          answered: false
        }
      };

      var onComplete = function(error) {
        if (error) {
          //console.log('Session creation failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Session created');

          //add session to current user's sessions
          var ref = firebaseDb.ref('/userData/' + user.uid).child('sessions').push();
          ref.set(sessionId, function(error) {
            if (error) {
              //console.log('Session added');
              result.message = "Connection error";
              callback(result);
            } else {
              //console.log('Session added');

              //send request
              var newRequestRef = firebaseDb.ref('/userData/' + tutor).child('notifications').push();
              newRequestRef.set(request, function(error) {
                if (error) {
                  //console.log('Failed to deliver request');
                  result.message = "Connection error";
                  callback(result);
                } else {
                  //console.log('New tutoring request sent');
                  result.message = "Tutoring session request sent";
                  result.success = true;
                  callback(result);

                  //increment new message count
                  var ref = firebaseDb.ref('/userData/' + tutor).child('newNotificationNumber');
                  ref.transaction(function (current_value) {
                      return (current_value || 0) + 1;
                    }, function(error) {
                      if (error) {
                        //console.log('Incrementing new notification count failed');
                      } else {
                        //console.log('New notification count incremented');
                      }
                    }
                  );
                }
              });

            }
          });
        }
      };
      newSessionRef.set(session, onComplete);

    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Accept a new tutoring session
   *
   */
  acceptSession: (student, request, notificationId, callback) => {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function () {
        return new Date().getTime();
      }
    }

    var result = {
      success: false,
      message: ""
    };

    var user = firebaseAuth.currentUser;
    if (user) {
      //add session to current user's session
      var sessionRef = firebaseDb.ref('/userData/' + user.uid).child('sessions').push();
      var onComplete = function(error) {
        if (error) {
          //console.log('Session creation failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Session added');

          //update request status
          firebaseDb.ref('/userData/' + user.uid + '/notifications/').child(notificationId).update({answered: true}, function(error) {
            if (error) {
              //console.log('Failed to update request');
            } else {
              //console.log('Request updated');
            }
          });

          //update session status
          var sessionUpdate = {
            status: "scheduled"
          };
          firebaseDb.ref('/sessions/').child(request.sessionId).update(sessionUpdate, function(error) {
            if (error) {
              //console.log('Failed to update session');
              result.message = "Connection error";
              callback(result);
            } else {
              //console.log('Session updated');

              //send notification
              var date = new Date(request.startTime);
              var end = new Date(request.endTime);
              var notification = {
                senderId: user.uid,
                senderName: "LearnIt",
                senderPhoto: user.photoURL,
                type: "notification",
                message: user.displayName+" has accepted your tutoring request.\nYour session is scheduled for "+
                date.toLocaleDateString()+" from "+date.toLocaleTimeString()+" to "+end.toLocaleTimeString()+
                ".\nThe subject is "+request.subject+".",
                timestamp: Date.now(),
              };
              var notificationRef = firebaseDb.ref('/userData/' + student).child('notifications').push();
              notificationRef.set(notification, function(error) {
                if (error) {
                  //console.log('Failed to deliver response');
                  result.message = "Connection error";
                  callback(result);
                } else {
                  //console.log('New tutoring response sent');
                  result.message = "Tutoring session accepted";
                  result.success = true;
                  callback(result);

                  //increment new message count
                  var ref = firebaseDb.ref('/userData/' + student).child('newNotificationNumber');
                  ref.transaction(function (current_value) {
                      return (current_value || 0) + 1;
                    }, function(error) {
                      if (error) {
                        //console.log('Incrementing new notification count failed');
                      } else {
                        //console.log('New notification count incremented');
                      }
                    }
                  );
                }
              });

            }
          });

        }
      };
      sessionRef.set(request.sessionId, onComplete);

    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Reject a new tutoring session
   *
   */
  rejectSession: (student, request, notificationId, callback) => {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function () {
        return new Date().getTime();
      }
    }

    var result = {
      success: false,
      message: ""
    };

    var user = firebaseAuth.currentUser;
    if (user) {
      //add session to current user's session
      var sessionUpdate = {
        status: "rejected"
      };
      var onComplete = function(error) {
        if (error) {
          //console.log('Session rejection failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Session rejected');


          //update request status
          firebaseDb.ref('/userData/' + user.uid + '/notifications/').child(notificationId).update({answered: true}, function(error) {
            if (error) {
              //console.log('Failed to update request');
            } else {
              //console.log('Request updated');
            }
          });

          //notify student
          var date = new Date(request.startTime);
          var notification = {
            senderId: user.uid,
            senderName: "LearnIt",
            senderPhoto: user.photoURL,
            type: "notification",
            message: user.displayName+" has rejected your tutoring request for "+request.subject+" on "+date.toLocaleDateString(),
            timestamp: Date.now(),
          };
          var notificationRef = firebaseDb.ref('/userData/' + student).child('notifications').push();
          notificationRef.set(notification, function(error) {
            if (error) {
              //console.log('Failed to deliver rejection notification');
              result.message = "Connection error";
              callback(result);
            } else {
              //console.log('New tutoring rejection notification sent');
              result.message = "Tutoring session rejected";
              result.success = true;
              callback(result);

              //increment new message count
              var ref = firebaseDb.ref('/userData/' + student).child('newNotificationNumber');
              ref.transaction(function (current_value) {
                  return (current_value || 0) + 1;
                }, function(error) {
                  if (error) {
                    //console.log('Incrementing new notification count failed');
                  } else {
                    //console.log('New notification count incremented');
                  }
                }
              );
            }
          });

        }
      };
      firebaseDb.ref('/sessions/').child(request.sessionId).update(sessionUpdate, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Complete a tutoring session
   *
   */
  completeSession: (sessionId, callback) => {
    var user = firebaseAuth.currentUser;
    var result = {
      success: false,
      message: ""
    };
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Session ended');
          result.message = "Session ended";
          result.success = true;
          callback(result);
        }
      };
      firebaseDb.ref('/sessions/').child(sessionId).update({ status: "completed" }, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Rate and review a tutoring session
   *
   */
  rateSession: (sessionId, tutorId, stars, comment, callback) => {
    var user = firebaseAuth.currentUser;
    var result = {
      success: false,
      message: ""
    };
    if (user) {
      var update = {
        name: user.displayName,
        photoUrl: user.photoURL,
        rating: stars,
        comment: comment,
      };
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Session rated');

          //update tutor's info
          firebaseDb.ref('/profiles/' + tutorId).child('tutorInfo').transaction(function(tutorInfo) {
            if (tutorInfo) {
              //console.log('updating tutor info');
              var key = sessionId.toString();
              if (tutorInfo.reviews) {
                //console.log('not first review');
                tutorInfo.reviews[key] = update;
                //console.log(tutorInfo.reviews[key]);
                var sum = 0;
                var count = 0;
                for (var r in tutorInfo.reviews) {
                  //console.log(tutorInfo.reviews[r].rating);
                  sum += tutorInfo.reviews[r].rating;
                  count++;
                  //console.log('sum: ' + sum + ' count: ' + count);
                }
                var average;
                if (count == 0)
                  average = 0;
                else
                  average = Math.round(sum*10.0/count)/10;
                //console.log('average: '+average);
                tutorInfo.rating = average;
                //console.log('rating submitted')
              } else {
                //console.log('first review');
                tutorInfo.reviews = {};
                tutorInfo.reviews[key] = update;
                tutorInfo.rating = update.rating;
              }
            }
            return tutorInfo;
          }, function(error, committed, snapshot) {
            if (error) {
              //console.log('Transaction failed abnormally!', error);
              result.message = "Connection error";
              callback(result);
            } else if (!committed) {
              //console.log('No change.');
              result.message = "Connection error";
              callback(result);
            } else {
              //console.log('TutorInfo updated!');
              result.message = "Review added";
              result.success = true;
              callback(result);
            }
            //console.log("TutorInfo: ", snapshot.val());
          });
        }
      };
      firebaseDb.ref('/sessions/').child(sessionId).update({rating: stars, comment: comment}, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Cancel a tutoring session
   *
   */
  cancelSession: (sessionId, session, callback) => {
    //for browser compatibility
    if (!Date.now) {
      Date.now = function () {
        return new Date().getTime();
      }
    }

    var user = firebaseAuth.currentUser;
    var result = {
      success: false,
      message: ""
    };
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Session canceled: '+sessionId);
          result.message = "Session canceled";
          result.success = true;
          callback(result);

          //notify the other person
          var date = new Date(session.startTime);
          var role, otherId;
          if (user.uid == session.tutorId) {
            role = "tutor";
            otherId = session.studentId;
          } else {
            role = "student";
            otherId = session.tutorId;
          }
          var notification = {
            senderId: user.uid,
            senderName: "LearnIt",
            senderPhoto: user.photoURL,
            type: "notification",
            message: "Your "+role+", "+user.displayName+" has canceled your tutoring session for "+session.subject+
            " on "+date.toLocaleDateString(),
            timestamp: Date.now(),
          };
          var notificationRef = firebaseDb.ref('/userData/' + otherId).child('notifications').push();
          notificationRef.set(notification, function(error) {
            if (error) {
              //console.log('Failed to deliver cancellation notification');
            } else {
              //console.log('New session cancellation notification sent');

              //increment new message count
              var ref = firebaseDb.ref('/userData/' + otherId).child('newNotificationNumber');
              ref.transaction(function (current_value) {
                  return (current_value || 0) + 1;
                }, function(error) {
                  if (error) {
                    //console.log('Incrementing new notification count failed');
                  } else {
                    //console.log('New notification count incremented');
                  }
                }
              );
            }
          });
        }
      };
      firebaseDb.ref('/sessions/').child(sessionId).update({ status: "canceled" }, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Pay for a tutoring session
   *
   */
  payForSession: (sessionId, session, callback) => {
    var user = firebaseAuth.currentUser;
    var result = {
      success: false,
      message: ""
    };
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Payment status updated: '+sessionId);
          result.message = "Payment status updated";
          result.success = true;
          callback(result);

        }
      };
      firebaseDb.ref('/sessions/').child(sessionId).update({ paymentStatus: "pending" }, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  },

  /**
   * Accept payment for a tutoring session
   *
   */
  acceptPayForSession: (sessionId, session, callback) => {
    var user = firebaseAuth.currentUser;
    var result = {
      success: false,
      message: ""
    };
    if (user) {
      //console.log('User is signed in');
      var onComplete = function(error) {
        if (error) {
          //console.log('Synchronization failed');
          result.message = "Connection error";
          callback(result);
        } else {
          //console.log('Payment status updated: '+sessionId);
          result.message = "Payment status updated";
          result.success = true;
          callback(result);

        }
      };
      firebaseDb.ref('/sessions/').child(sessionId).update({ paymentStatus: "paid" }, onComplete);
    } else {
      //console.log('User is not signed in');
      result.message = "Connection error";
      callback(result);
    }
  }
};

export default FireBaseTools;
