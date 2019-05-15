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

// Fetches events that are either ongoing or upcoming  from firestore. We add doc_id to each event object as well just in case its needed.
export const getFeedEvents = async () => {
  var returnArr = [];
  var eventsRef = firestore.collection('events');
  await eventsRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data = doc.data();
        data.doc_id = doc.id;

        // start time of the event in seconds
        let eventFromDate = data.from_date.seconds;
        // current time in seconds
        let currentDate = Date.now() / 1000.0;

        // An event is upcoming if event from_date is greater than current date
        if (eventFromDate > currentDate) {
          returnArr.push(data);
        }
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

// Given a user doc id, returns a set with the event objects the user is going to or interested in
export const getEventsForProfile = async userDocId => {
  const eventIds = await getAllUserEventsRef(userDocId);
  const profileEvents = await getEventsFromArrOfRefs(eventIds);
  return profileEvents;
}

// Given a user doc id, returns a set with the doc ids of events user is going to or interested in
// Returns none in case of error.
export const getAllUserEventsRef = async userDocId => {
  eventRefs = new Set();
  await firestore
    .collection('users')
    .doc(userDocId)
    .get()
    .then(snapshot => {
      let interestedRefs = snapshot.get('event_refs.interested');
      interestedRefs.forEach(ref => eventRefs.add(ref.id));
      let goingRefs = snapshot.get('event_refs.going');
      goingRefs.forEach(ref => eventRefs.add(ref.id));
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return eventRefs;
};

// Given a list of event references, returns a set with the event objects a user is going to or interested in
// Returns none in case of error.
export const getEventsFromArrOfRefs = async eventRefsArr => {
  let returnArrUpcoming = [];
  let returnArrPast = [];
  let returnArrOngoing = [];
  let eventsRef = firestore.collection('events');
  // const currentUserCommunityRef = await getUserCommunity(c.TEST_USER_ID);

  await eventsRef
    // .where('sponsors', 'array-contains', currentUserCommunityRef)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (eventRefsArr.has(doc.id)) {
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
  let name = '';
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

// Retrieve logo url given an organization reference
export const getOrganizationLogo = async orgRef => {
  let logo = '';
  await orgRef
    .get()
    .then(snapshot => {
      logo = snapshot.get('logo_url');
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return logo;
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

// userDocSnapshots: array of user snapshots for whom we want to get data from
// attributes: array of strings representing the attributes we want to get from each user. ex: ['name', 'profile_pic_url' ]
// Uses concurrency, should be able to work for many users (more than 100)
// Returns an array of user objects, where each object is a map with the attribute names as keys
// specified in attributes and the value is the one that corresponds to the user.
export const getUsersAttributes = async (userDocSnapshots, attributes) => {
  // Easy way: https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181ba
  // Robust implementation: http://bluebirdjs.com/docs/api/promise.map.html

  let results = [];
  userDocSnapshots.forEach(snapshot => {
    let result = {};
    attributes.forEach(attribute => {
      result[attribute] = snapshot.get(attribute);
    });
    result['id'] = snapshot.id;
    results.push(result);
  });
  return results;
};

// Returns a DefaultDict that maps from each eventDocId to the number of users going to it.
// Note: Assumes there are no duplicates in the going list.
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

// Returns a DefaultDict that maps from each eventDocID to an array of user ids going
export const getUsersGoingForAllEvents = async () => {
  var attendees = {};
  var usersRef = firestore.collection('users');
  await usersRef
    .get()
    .then(snapshot => {
      snapshot.forEach(userDoc => {
        try {
          let going = userDoc.get('event_refs.going');
          going.forEach(eventRef => {
            if (!(eventRef.id in attendees)) {
              attendees[eventRef.id] = [];
            }
            attendees[eventRef.id].push(userDoc.id);
          });
        } catch (error) {
          console.log(error);
        }
      });
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return attendees;
};

// Takes in reference to a community object, such as the output of getUserCommunity
// Returns a list of user ids of members in the specified community
export const getCommunityMemberUserIds = async communityRef => {
  var communityMembers = [];
  var usersRef = firestore.collection('users');
  await usersRef
    .where('community_ref', '==', communityRef)
    .get()
    .then(snapshot => {
      snapshot.forEach(userDoc => {
        communityMembers.push(userDoc.id);
      });
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return communityMembers;
};

// Takes in a reference to an event object
// Returns a list of the event's interest names
export const getEventInterestNames = async eventRef => {
  var interestRefs = [];
  await eventRef.get().then(snapshot => {
    interestRefs = snapshot.get('interest_refs');
  });
  return await Promise.all(
    interestRefs.map(async interestRef => {
      var interestSnapshot = await interestRef.get();
      return interestSnapshot.get('name');
    })
  );
};

// Takes in a reference to an event object
// Returns the actual event object with data we need
export const getEvent = async eventRef => {
  var event = {};
  event = await eventRef.get().then(snapshot => {
    var data = snapshot.data();
    data.doc_id = snapshot.id;
    return data;
  });
  return event;
};
