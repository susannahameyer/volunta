import { firestore } from './firebase';

// Fetches all events array from firestore. We add doc_id to each event object as well just in case its needed.
export const getEvents = async () => {
  var returnArr = [];
  var eventsRef = firestore.collection('events');
  await eventsRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data = doc.data();
        data.doc_id = doc.id;
        returnArr.push(data);
      });
    })
    .catch(error => console.log(error));
  return returnArr;
};

// Fetch event data for the community page
// comingUp prop is hard-coded here for now
export const getEventsForCommunity = async () => {
  let returnArrUpcoming = [];
  let returnArrPast = [];
  let returnArr = [];
  let eventsRef = firestore.collection('events');
  await eventsRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data = doc.data();
        data.doc_id = doc.id;

        let eventDate = data.from_date.seconds;
        let currentDate = Date.now() / 1000.0;
        data.comingUp = (eventDate >= currentDate);
        if (data.comingUp) {
          returnArrUpcoming.push(data);
        } else {
          returnArrPast.push(data);
        }

        returnArr.push(data);
      });
    })
    .catch(error => console.log(error));

  // console.log(returnArrUpcoming.length);
  // console.log(returnArrPast.length);
  // // Add whether an event is coming up or past
  // let finalEvents = [];
  // for (let event of returnArr) {
  //   let eventDate = event.from_date.seconds;
  //   let currentDate = Date.now() / 1000.0;

  //   event.comingUp = (eventDate >= currentDate);
  //   finalEvents.push(event);
  // }
  // return finalEvents;
  return [returnArrUpcoming, returnArrPast];
};

// Logic to retrieve organization name from an organization reference
export const getOrganizationName = async orgRef => {
  name = '';
  await orgRef
    .get()
    .then(snapshot => {
      name = snapshot.get('name');
    })
    .catch(error => console.log(error));
  return name;
};

// Given a user doc id, returns a set with the doc ids of all events the user is interested in
// Returns none in case of error.
export const getAllUserInterestedEventsDocIds = async userDocId => {
  interested = new Set();
  await firestore
    .collection('users')
    .doc(userDocId)
    .get()
    .then(snapshot => {
      interested_refs = snapshot.get('event_refs.going');
    })
    .catch(error => {
      console.log(error);
      return;
    });
  interested_refs.forEach(ref => interested.add(ref.id));
  return interested;
};
