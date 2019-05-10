import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
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
} from '../firebase/api';
import * as c from '../firebase/fb_constants';

export default class EventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.navigation.getParam('event'),
      interested: this.props.navigation.getParam('interested'),
      facePileAttendees: [],
      refreshing: true,
      orgName: this.props.navigation.getParam('org_name'),
      orgLogo: '../assets/images/logo.png', //This never actually renders, but avoids empty string warnings.
      going: false,
      numGoing: 0,
      numGoingFromCommunity: 0,
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const event = this.state.event;
    const eventRef = firestore.collection('events').doc(event.doc_id);
    const orgLogo = await getOrganizationLogo(event.org_ref);

    // Get dictionary of all events attendendees to be used to check whether user is going
    // Get current user community to find attendees in common with community members
    // Get users going and interested in the event for Facepile
    const [
      allEventsAttendees,
      currentUserCommunityRef,
      attendeesGoing,
      attendeesInterested,
    ] = await Promise.all([
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
    // Merge going and interested users to display on Facepile
    const facePileAttendees = attendeesGoing.concat(attendeesInterested);

    // Isolate IDs for users displayed on Facepile to compare to community members
    allGoingOrInterestedIds = [];
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

    this.setState({
      facePileAttendees,
      refreshing: false,
      orgLogo,
      going: allEventsAttendees[event.doc_id].includes(c.TEST_USER_ID),
      numGoing: facePileAttendees.length,
      numGoingFromCommunity,
    });
  };

  // TODO: get event info needed to pass to different components, all hard-coded for now
  // Title, organization name, organization logo, event cover photo --> EventPageHeader
  // Whether current user is interested / going --> EventPageButtonBar
  // Event from_date and to_date --> EventPageAboutSection
  // userIDs of users attending / interested --> Facepile + number in user's community
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
        <ScrollView>
          <EventPageHeader
            eventTitle={event.title}
            organizationName={orgName}
            organizationLogo={orgLogo}
            coverPhoto={event.cover_url}
          />
          <EventPageButtonBar interested={interested} going={going} />
          <EventPageAboutSection
            fromDate={event.from_date}
            toDate={event.to_date}
            location={event.location}
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
