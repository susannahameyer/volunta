import { firestore } from './firebase';
import * as c from './fb_constants';

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

  await eventsRef.where('sponsors', 'array-contains', currentUserCommunityRef)
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
}

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
}

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
}