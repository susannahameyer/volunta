import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import EventPageHeader from '../components/EventPageHeader';
import EventPageButtonBar from '../components/EventPageButtonBar';
import EventPageAboutSection from '../components/EventPageAboutSection';
import Facepile from '../components/Facepile';
import { firestore } from '../firebase/firebase';
import {
  getUsersAttributes,
  getOrganizationLogo,
  getUsersGoingForAllEvents,
  getCommunityMemberUserIds,
  getUserCommunity,
  getEventInterestNames,
  getEvent,
  getAllUserInterestedEventsDocIds,
  updateUserInterestedEvents,
  updateUserGoingEvents,
} from '../firebase/api';
import * as c from '../firebase/fb_constants';

export default class EventScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      event: this.props.navigation.getParam('event'),
      interested: this.props.navigation.getParam('interested') ? true : false,
      facePileAttendees: [],
      refreshing: true,
      orgName: this.props.navigation.getParam('org_name'),
      orgLogo: '../assets/images/logo.png', //This never actually renders, but avoids empty string warnings.
      going: false,
      numGoing: 0,
      numGoingFromCommunity: 0,
      interests: [],
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    this._loadData();
  }

  _loadData = async () => {
    var event = this.state.event;
    const eventRef = firestore.collection('events').doc(event.doc_id);
    // Get event to load any updates on refresh
    event = await getEvent(eventRef);

    const [
      // Get list of interests that correspond to the event
      interests,
      // Get organization logo URL
      orgLogo,
      // Get dictionary of all events attendendees to be used to check whether user is going
      allEventsAttendees,
      // Get current user community to find attendees in common with community members
      currentUserCommunityRef,
      // Get users going and interested in the event for Facepile
      attendeesGoing,
      attendeesInterested,
    ] = await Promise.all([
      getEventInterestNames(eventRef),
      getOrganizationLogo(event.org_ref),
      getUsersGoingForAllEvents(),
      // TODO: Change to current user
      getUserCommunity(c.TEST_USER_ID),
      firestore
        .collection('users')
        .where('event_refs.going', 'array-contains', eventRef)
        .get()
        .then(
          async snapshot =>
            await getUsersAttributes(snapshot.docs, ['name', 'profile_pic_url'])
        ),
      firestore
        .collection('users')
        .where('event_refs.interested', 'array-contains', eventRef)
        .get()
        .then(
          async snapshot =>
            await getUsersAttributes(snapshot.docs, ['name', 'profile_pic_url'])
        ),
    ]);

    // Get IDs of all users going to event
    var allGoingIds = [];
    attendeesGoing.forEach(user => {
      allGoingIds.push(user['id']);
    });

    // Get IDs of all users interested in event
    // Don't include user in interested list if
    // they are already going to avoid duplicates
    var allInterestedIds = [];
    var attendeesOnlyInterested = [];

    attendeesInterested.forEach(user => {
      if (!allGoingIds.includes(user['id'])) {
        allInterestedIds.push(user['id']);
        attendeesOnlyInterested.push(user);
      }
    });

    // Merge going and interested lists to display users on Facepile
    var facePileAttendees = attendeesGoing.concat(attendeesOnlyInterested);

    // Isolate IDs for users displayed on Facepile to compare to community members
    var allGoingOrInterestedIds = [];
    facePileAttendees.forEach(user => {
      allGoingOrInterestedIds.push(user['id']);
    });

    // Get number of attendees in common with user's community members
    const allCommunityMembers = await getCommunityMemberUserIds(
      currentUserCommunityRef
    );
    const numGoingFromCommunity = allGoingOrInterestedIds.filter(user =>
      allCommunityMembers.includes(user)
    ).length;

    if (this._isMounted) {
      this.setState({
        event,
        facePileAttendees,
        refreshing: false,
        orgLogo,
        going: allEventsAttendees[event.doc_id].includes(c.TEST_USER_ID),
        numGoing: facePileAttendees.length,
        numGoingFromCommunity,
        interests,
      });
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  _updateInterested = async () => {
    // Toggle button in frontend
    var newInterested = !this.state.interested;
    this.setState({
      interested: newInterested,
    });

    // Try to update in database
    success = await updateUserInterestedEvents(
      c.TEST_USER_ID, //TODO: Make this the current user
      this.state.event.doc_id,
      newInterested
    );

    // Toggle back if database update failed.
    if (!success) {
      this.setState({
        interested: !newInterested,
      });
    }
  };

  _updateGoing = async () => {
    // Toggle button in frontend
    var newGoing = !this.state.going;
    this.setState({
      going: newGoing,
    });

    // Try to update in database
    success = await updateUserGoingEvents(
      c.TEST_USER_ID, //TODO: Make this the current user
      this.state.event.doc_id,
      newGoing
    );

    // Toggle back if database update failed.
    if (!success) {
      this.setState({
        going: !newGoing,
      });
    }
  };

  render() {
    var {
      event,
      interested,
      facePileAttendees,
      refreshing,
      orgName,
      orgLogo,
      going,
      numGoing,
      numGoingFromCommunity,
      interests,
    } = this.state;

    // Render Facepile view only if there are users interested or going
    var facepileView = (
      <Text style={[styles.detailText, styles.numGoingText]}>
        Be the first to join the event!
      </Text>
    );
    if (numGoing > 0) {
      facepileView = (
        <View>
          <Facepile
            totalWidth={335}
            maxNumImages={10}
            imageDiameter={50}
            members={facePileAttendees}
            pileTitle="Event Attendees"
            navigation={this.props.navigation}
          />
          <Text style={[styles.detailText, styles.numGoingText]}>
            {numGoing +
              ' going or interested including ' +
              numGoingFromCommunity +
              ' from your community'}
          </Text>
        </View>
      );
    }

    if (!refreshing) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this._loadData()}
            />
          }
        >
          <EventPageHeader
            eventTitle={event.title}
            organizationName={orgName}
            organizationLogo={orgLogo}
            coverPhoto={event.cover_url}
          />
          <EventPageButtonBar
            interested={interested}
            going={going}
            onPressInterested={this._updateInterested}
            onPressGoing={this._updateGoing}
          />
          <EventPageAboutSection
            fromDate={event.from_date}
            toDate={event.to_date}
            location={event.location}
            interests={interests}
            eventName={event.title}
          />
          <View style={styles.divider}>
            <View style={styles.facepileContainer}>
              <Text style={styles.sectionText}>{"Who's going?"}</Text>
              {facepileView}
            </View>
          </View>
          <View style={styles.facepileContainer}>
            <Text style={styles.sectionText}>{'Details'}</Text>
            <Text style={styles.detailText}>{event.description}</Text>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size={0} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#DADADA',
    borderBottomWidth: 1,
  },
  facepileContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionText: {
    fontSize: 18,
    fontFamily: 'montserrat-bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'montserrat',
  },
  numGoingText: {
    marginTop: 10,
    marginBottom: 3,
  },
  activityIndicator: {
    marginTop: 300,
  },
});
