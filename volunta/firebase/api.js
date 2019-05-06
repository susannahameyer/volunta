import { firestore } from './firebase';
var Promise = require('bluebird');
import * as c from './fb_constants';
import { DefaultDict } from '../utils';

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
  const currentUserCommunityRef = await getUserCommunity(c.TEST_USER_ID);

  await eventsRef
    .where('sponsors', 'array-contains', currentUserCommunityRef)
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
      let interested_refs = snapshot.get('event_refs.interested');
      interested_refs.forEach(ref => interested.add(ref.id));
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return interested;
};

// Retrieve the community reference object for the current user
export const getUserCommunity = async userDocId => {
  let communityRef = '';
  await firestore
    .collection('users')
    .doc(userDocId)
    .get()
    .then(snapshot => {
      communityRef = snapshot.get('community_ref');
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return communityRef;
};

// Retreive cover photo url for a given community reference
export const getCommunityCoverPhoto = async communityRef => {
  let url = '';
  await communityRef
    .get()
    .then(snapshot => {
      url = snapshot.get('cover_url');
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return url;
};

// Retrieve name for a given community reference
export const getCommunityName = async communityRef => {
  let name = '';
  await communityRef
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

// userRefs: array of user references for whom we want to get data from
// attributes: array of strings representing the attributes we want to get from each user. ex: ['name', 'profile_pic_url' ]
// Uses concurrency, should be able to work for many users (more than 100)
// Returns a map, where each key is a user id (from the ref) and the value is another map where each key is an attribute
// specified in attributes and the value is the one that corresponds to the user.
export const getUsersAttributes = async (userRefs, attributes) => {
  // Easy way: https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181ba
  // Robust implementation: http://bluebirdjs.com/docs/api/promise.map.html
  let results = {};
  Promise.map(userRefs, ref => {
    // Promise.map awaits for returned promises as well.
    return ref.get();
  })
    .then(snapshots => {
      snapshots.forEach(snapshot => {
        let result = {};
        attributes.forEach(attribute => {
          result[attribute] = snapshot.get(attribute);
        });
        results[snapshot.id] = result;
      });
      return results;
    })
    .catch(error => {
      console.log(error);
      return null;
    });
};

// Returns a DefaultDict that maps from each eventDocId to the number of users going to it.
// If eventId is not a key, the value will default to zero.
// For each user, for each of the events they are going to:
//    a) if event is not in our results map, add it with value 1
//    b) otherwise increment value by 1 for that event.
export const getNumGoingForAllEvents = async () => {
  const counts = new DefaultDict(0);
  var usersRef = firestore.collection('users');
  await usersRef
    .get()
    .then(snapshot => {
      snapshot.forEach(userDoc => {
        try {
          let going = userDoc.get('event_refs.going');
          going.forEach(eventRef => {
            counts[eventRef.id] += 1;
          });
        } catch (error) {}
      });
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return counts;
};
