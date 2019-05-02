import { firestore } from './firebase';
var Promise = require('bluebird');

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
      interested_refs = snapshot.get('event_refs.going');
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  interested_refs.forEach(ref => interested.add(ref.id));
  return interested;
};

// userDocIds: array of user doc ids for whom we want to get data from
// attributes: array of strings representing the attributes we want to get from each user. ex: ['name', 'profile_pic_url' ]
export const getUsersAttributes = async (userRefs, attributes) => {
  // Easy way: https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181ba
  // For a 'handful of users'

  // // Map the Firebase promises into an array
  // const userPromises = userRefs.map(ref => {
  //   return ref.get();
  // });

  // // For each user get all the att
  // let results = [];
  // Promise.all(userPromises).then(snapshots => {
  //   snapshots.forEach(snapshot => {
  //     result = {};
  //     attributes.forEach(attribute => {
  //       result[attribute] = snapshot.get(attribute);
  //     });
  //     console.log(result);
  //     results.push(result);
  //   });
  // });
  // console.log(results);
  // return results;

  // If we need a more robust implementation, see: http://bluebirdjs.com/docs/api/promise.map.html (does not look that hard, should probably try)
  let results = [];
  Promise.map(userRefs, ref => {
    // Promise.map awaits for returned promises as well.
    return ref.get();
  }).then(snapshots => {
    snapshots.forEach(snapshot => {
      result = {};
      attributes.forEach(attribute => {
        result[attribute] = snapshot.get(attribute);
      });
      console.log(result);
      results.push(result);
    });
  });
};
