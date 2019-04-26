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

// Logic to retrieve organization name from an organization reference
export const getOrganizationName = async org_ref => {
  name = '';
  await org_ref
    .get()
    .then(snapshot => {
      name = snapshot.get('name');
    })
    .catch(error => console.log(error));
  return name;
};
