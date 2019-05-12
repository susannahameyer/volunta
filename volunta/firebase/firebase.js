import * as firebase from 'firebase';
import 'firebase/firestore';
import * as c from './fb_constants';
// import FIREBASE_API_KEY from './apiKey';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCzGXdD8RYyiHg24lQ8zBsoBQuE-MBW2Jo',
  projectId: c.FIREBASE_PROJECT_ID,
  databaseURL: c.FIREBASE_DATABASE_URL
};

firebase.initializeApp(config);
export const firestore = firebase.firestore();
