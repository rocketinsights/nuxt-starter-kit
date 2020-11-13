import _ from 'lodash'
import firebase from 'firebase/app'
import 'firebase/auth'
// import 'firebase/firestore'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

const providers = {
  google: new firebase.auth.GoogleAuthProvider()
}

const getRedirectResult = async () => {
  try {
    const result  = await firebase.auth().getRedirectResult()
    if (!result.credential) return null
    return result.user
  } catch (err) {
    console.error('getRedirectResult error', {
      code: err.code,
      message: err.message,
      email: err.email,
      credential: err.credential
    })
  }
}

const signInWith = (provider = 'google') => {
  switch (_.toLower(provider)) {
    case 'google':
      firebase.auth().signInWithRedirect(providers.google)
      break
  }
}

if (_.isEmpty(firebase.apps)) firebase.initializeApp(config)

const auth = firebase.auth()

export {
  auth,
  getRedirectResult,
  signInWith
}
