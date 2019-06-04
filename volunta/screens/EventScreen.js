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
  getUserProperty,
  getEventInterestNames,
  getEvent,
  updateUserInterestedEvents,
  updateUserGoingEvents,
} from '../firebase/api';
import { Haptic } from 'expo';
import * as firebase from 'firebase';

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
    const eventRef = firestore
      .collection('events')
      .doc(this.state.event.doc_id);
    // Get event to load any updates on refresh
    let event = await getEvent(eventRef);
    let userId = await firebase.auth().currentUser.uid;

    var [
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
      getUserProperty(userId, 'community_ref'),
      firestore
        .collection('users')
        .where('event_refs.going', 'array-contains', eventRef)
        .get()
        .then(
          async snapshot =>
            await getUsersAttributes(snapshot.docs, [
              'name',
              'profile_pic_url',
              'profile_pic_is_base64',
            ])
        ),
      firestore
        .collection('users')
        .where('event_refs.interested', 'array-contains', eventRef)
        .get()
        .then(
          async snapshot =>
            await getUsersAttributes(snapshot.docs, [
              'name',
              'profile_pic_url',
              'profile_pic_is_base64',
            ])
        ),
    ]);
    attendeesGoing = attendeesGoing.filter(attendee => {
      attendee['id'] !== userId;
    });
    attendeesInterested = attendeesInterested.filter(attendee => {
      attendee['id'] !== userId;
    });

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

    const going =
      event.doc_id in allEventsAttendees
        ? allEventsAttendees[event.doc_id].includes(userId)
        : false;

    if (this._isMounted) {
      this.setState({
        event,
        facePileAttendees,
        refreshing: false,
        orgLogo,
        going,
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
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);

    // Toggle button in frontend
    var newInterested = !this.state.interested;
    this.setState({
      interested: newInterested,
    });

    // Try to update in database
    let userId = await firebase.auth().currentUser.uid;
    success = await updateUserInterestedEvents(
      userId,
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
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);

    // Toggle button in frontend
    var newGoing = !this.state.going;
    this.setState({
      going: newGoing,
    });

    // Try to update in database
    let userId = await firebase.auth().currentUser.uid;
    success = await updateUserGoingEvents(
      userId,
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
    console.log(facePileAttendees);

    let goingStr =
      numGoing == numGoingFromCommunity
        ? numGoing + ' going or interested, all from your community '
        : numGoing +
          ' going or interested including ' +
          numGoingFromCommunity +
          ' from your community';
    if (numGoingFromCommunity == 0) {
      goingStr = numGoing + ' going or interested';
    }

    // Render Facepile view only if there are users interested or going
    const emptyFacepileText = going
      ? "You're the first to join this event!"
      : 'Be the first to join the event!';
    var facepileView = (
      <Text style={styles.detailText}>{emptyFacepileText}</Text>
    );
    if (numGoing > 0) {
      facepileView = (
        <View>
          <Facepile
            totalWidth={335}
            maxNumImages={10}
            imageDiameter={50}
            members={facePileAttendees}
            pileTitle="Event Followers"
            navigation={this.props.navigation}
          />
          <Text style={[styles.detailText, styles.numGoingText]}>
            {goingStr}
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
              <Text style={styles.sectionText}>who's going?</Text>
              {facepileView}
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionText}>details</Text>
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
    marginHorizontal: 20,
  },
  facepileContainer: {
    marginVertical: 12,
  },
  detailsContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionText: {
    fontSize: 18,
    fontFamily: 'raleway-medium',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'raleway',
  },
  numGoingText: {
    marginTop: 10,
    marginBottom: 3,
  },
  activityIndicator: {
    marginTop: 300,
  },
});
