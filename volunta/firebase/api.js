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
    .catch(error => {
      console.log(error);
      return null;
    });
  return returnArr;
};

// Fetch event data for the community page
// TODO: finalize logic for upcoming vs past vs ongoing events
export const getEventsForCommunity = async () => {
  let returnArrUpcoming = [];
  let returnArrPast = [];
  let returnArrOngoing = [];
  let eventsRef = firestore.collection('events');
  await eventsRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data = doc.data();
        data.doc_id = doc.id;

        // start time of the event in seconds
        let eventFromDate = data.from_date.seconds;
        // end time of the event in seconds
        let eventEndDate = data.to_date.seconds;
        // current time in seconds
        let currentDate = Date.now() / 1000.0;

        // An event is upcoming if event from_date is greater than current date
        if (eventFromDate > currentDate) {
          data.status = 'upcoming';
          returnArrUpcoming.push(data);
          // An event is in the past if event to_date is less than current date
        } else if (eventEndDate < currentDate) {
          data.status = 'past';
          returnArrPast.push(data);
          // This means that from_date <= current date and to_date >= current date,
          // so the event is currently ongoing
        } else {
          data.status = 'ongoing';
          returnArrOngoing.push(data);
        }
      });
    })
    .catch(error => {
      console.log(error);
      return null;
    });

  return [returnArrUpcoming, returnArrPast, returnArrOngoing];
};

// Logic to retrieve organization name from an organization reference
export const getOrganizationName = async orgRef => {
  name = '';
  await orgRef
    .get()
    .then(snapshot => {
      name = snapshot.get('name');
    })
    .catch(error => {
      console.log(error);
      return null;
    });
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
      interested_refs = snapshot.get('event_refs.interested');
      interested_refs.forEach(ref => interested.add(ref.id));
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return interested;
};

// Update list of events that user is interested on
// add: boolean specifying if we want to add (true) or remove (false) the eventId from the userId's iterested events list.
// Returns true if success otherwise false
// We use a transaction since we both get and update.
// TODO: make sure we return false in case there is a connection error, this is currently not working. Not sure how to verify if the transaction was successful!! Currently the .catch is never reached..
export const updateUserInterestedEvents = async (userId, eventId, add) => {
  const userRef = await firestore.collection('users').doc(userId);
  const eventToUpdateRef = await firestore.collection('events').doc(eventId);
  await firestore
    .runTransaction(async transaction => {
      const userDoc = await transaction.get(userRef);
      let events = await userDoc.get('event_refs.interested');
      if (add) {
        events.push(eventToUpdateRef); // Simply push the new eventRef
      } else {
        // Make set of all current ids except the one we are removing (probably do not want to check for reference inclusion) since reference objects are large.
        // We use a set to make sure there are no duplicates.
        updatedSet = new Set();
        events.forEach(eventRef => {
          if (eventRef.id !== eventId) updatedSet.add(eventRef.id);
        });
        events = new Array();
        updatedSet.forEach(eventId => {
          events.push(firestore.collection('events').doc(eventId));
        });
      }
      transaction.update(userRef, 'event_refs.interested', events);
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  return true;
};
