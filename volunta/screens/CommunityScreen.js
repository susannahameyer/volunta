import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Facepile from '../components/Facepile';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import {
  getEventsForCommunity,
  getCommunityName,
  getCommunityCoverPhoto,
  getUserProperty,
  getAllUserInterestedEventsDocIds,
  getUsersAttributes,
  getAllUserGoingEventsDocIds,
  getCommunityDescription,
  getOrganizationName,
} from '../firebase/api';
import * as firebase from 'firebase';
import { firestore } from '../firebase/firebase';
import { timestampToDate } from '../utils';

export default class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: [],
      pastEvents: [],
      communityPhoto: '../assets/images/logo.png', //This never actually renders, but avoids empty string warnings.
      communityName: '',
      interestedEventDocIds: new Set(),
      goingEventDocIds: new Set(),
      refreshing: true,
      communityMembers: [],
      dateAndOrgMap: {},
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    let userId = await firebase.auth().currentUser.uid;

    // Get current user's community data
    const currentUserCommunityRef = await getUserProperty(
      userId,
      'community_ref'
    );

    const [
      communityName,
      communityPhoto,
      communityDescription,
      interestedEventDocIds,
      goingEventDocIds,
      communityMembers,
      [upcomingEvents, pastEvents, ongoingEvents],
    ] = await Promise.all([
      getCommunityName(currentUserCommunityRef),
      getCommunityCoverPhoto(currentUserCommunityRef),

      getCommunityDescription(currentUserCommunityRef),

      // Get doc IDs the current user has bookmarked and is going to
      getAllUserInterestedEventsDocIds(userId),
      getAllUserGoingEventsDocIds(userId),

      // Get community members for Facepile
      firestore
        .collection('users')
        .where('community_ref', '==', currentUserCommunityRef)
        .get()
        .then(
          async snapshot =>
            await getUsersAttributes(snapshot.docs, [
              'name',
              'profile_pic_url',
              'profile_pic_is_base64',
            ])
        ),

      getEventsForCommunity(currentUserCommunityRef),
    ]);

    dateAndOrgMap = {};
    for (const event of upcomingEvents) {
      let org_name = await getOrganizationName(event.org_ref);
      let date = timestampToDate(event.from_date);
      dateAndOrgMap[event.doc_id] = [org_name, date];
    }
    for (const event of pastEvents) {
      let org_name = await getOrganizationName(event.org_ref);
      let date = timestampToDate(event.from_date);
      dateAndOrgMap[event.doc_id] = [org_name, date];
    }

    this.setState({
      upcomingEvents,
      pastEvents,
      communityPhoto,
      communityName,
      userId,
      communityDescription,
      interestedEventDocIds,
      goingEventDocIds,
      refreshing: false,
      communityMembers,
      dateAndOrgMap,
    });
  };

  // onPress function to pass to CommunityProfileEventCards using screen navigation
  _onPressOpenEventPage = (event, org_name, interested) => {
    this.props.navigation.push('Event', {
      event,
      org_name,
      interested,
    });
  };

  render() {
    const {
      upcomingEvents,
      pastEvents,
      communityPhoto,
      communityName,
      interestedEventDocIds,
      goingEventDocIds,
      refreshing,
      communityMembers,
      dateAndOrgMap,
    } = this.state;
    if (!refreshing) {
      var facepileView = (
        <Text style={styles.descriptionText}>
          You're the first to join your community. Welcome!
        </Text>
      );
      if (communityMembers.length > 0) {
        facepileView = (
          <View>
            {this.state.communityMembers !== [] && (
              <Facepile
                totalWidth={335}
                maxNumImages={10}
                imageDiameter={50}
                members={communityMembers}
                pileTitle="Community Members"
                navigation={this.props.navigation}
                currentUserId={this.state.userId}
              />
            )}
          </View>
        );
      }

      // Don't display past events if empty
      var pastEventDisplay = null;
      var upcomingStyle = {};
      const hidePastEvents = pastEvents.length == 0;
      if (!hidePastEvents) {
        pastEventDisplay = (
          <View style={styles.sectionContainer}>
            <Text style={styles.titleText}>{"how we've helped"}</Text>
            <View style={styles.pastScroll}>
              <CommunityProfileEventCardHorizontalScroll
                events={pastEvents}
                onPress={this._onPressOpenEventPage}
                interestedIDs={interestedEventDocIds}
                goingIDs={goingEventDocIds}
                status={'past'}
                source={'community'}
                dateAndOrgMap={dateAndOrgMap}
              />
            </View>
          </View>
        );
      } else {
        // Remove spacing at the bottom when past events are empty
        upcomingStyle = { height: 0 };
      }

      return (
        // Invisible ScrollView component to add pull-down refresh functionality
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this._loadData()}
              />
            }
          >
            <View style={styles.screenContainer}>
              <CommunityCoverPhoto
                communityPhoto={communityPhoto}
                communityName={communityName}
              />
              <View style={[styles.sectionContainer, { width: 325 }]}>
                <Text style={styles.titleText}>{'about us'}</Text>
                <Text style={styles.descriptionText}>
                  {this.state.communityDescription}
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.titleText}>{'in my community'}</Text>
                {facepileView}
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.titleText}>{'coming up'}</Text>
                <View style={upcomingStyle}>
                  <CommunityProfileEventCardHorizontalScroll
                    events={upcomingEvents}
                    onPress={this._onPressOpenEventPage}
                    interestedIDs={interestedEventDocIds}
                    goingIDs={goingEventDocIds}
                    status={'upcoming'}
                    source={'community'}
                    dateAndOrgMap={dateAndOrgMap}
                  />
                </View>
              </View>
              {pastEventDisplay}
            </View>
          </ScrollView>
        </View>
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
  screenContainer: {
    flex: 1,
    paddingBottom: 34,
  },
  sectionContainer: {
    top: -85,
    marginBottom: 17,
    marginLeft: 19,
  },
  titleText: {
    fontFamily: 'raleway-medium',
    fontSize: 20,
    color: 'black',
    marginBottom: 8,
    marginTop: 12,
  },
  descriptionText: {
    fontFamily: 'raleway',
    fontSize: 14,
    color: '#444444',
  },
  pastScroll: {
    height: 0, //removes extra blank space at bottom of scroll
  },
  activityIndicator: {
    marginTop: 300,
  },
});
