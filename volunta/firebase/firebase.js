import * as firebase from 'firebase';
import 'firebase/firestore';
import * as c from './constants';

// Initialize Firebase
const config = {
  apiKey: c.FIREBASE_API_KEY,
  projectId: c.FIREBASE_PROJECT_ID,
  databaseURL: c.FIREBASE_DATABASE_URL
};

firebase.initializeApp(config);
export const firestore = firebase.firestore();
