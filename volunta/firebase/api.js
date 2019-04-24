import { firestore } from './firebase';

// Fetches events array from firestore
export const getEvents = async () => {
  var returnArr = [];
  var eventsRef = firestore.collection('events');
  await eventsRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        returnArr.push(doc.data());
      });
    })
    .catch(error => console.log(error));
  return returnArr;
};
