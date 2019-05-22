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
} from '../firebase/api';
import * as firebase from 'firebase';
import { firestore } from '../firebase/firebase';

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
      'cummunity_ref'
    );

    const [
      communityName,
      communityPhoto,
      interestedEventDocIds,
      goingEventDocIds,
      communityMembers,
      [upcomingEvents, pastEvents, ongoingEvents],
    ] = await Promise.all([
      getCommunityName(currentUserCommunityRef),
      getCommunityCoverPhoto(currentUserCommunityRef),

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
            await getUsersAttributes(snapshot.docs, ['name', 'profile_pic_url'])
        ),

      getEventsForCommunity(currentUserCommunityRef),
    ]);

    this.setState({
      upcomingEvents,
      pastEvents,
      communityPhoto,
      communityName,
      interestedEventDocIds,
      goingEventDocIds,
      refreshing: false,
      communityMembers,
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
    } = this.state;
    if (!refreshing) {
      return (
        // Invisible ScrollView component to add pull-down refresh functionality
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this._loadData()}
            />
          }
        >
          <View>
            <CommunityCoverPhoto
              communityPhoto={communityPhoto}
              communityName={communityName}
            />
            <View style={styles.topText}>
              <Text style={styles.titleText}>{'in my community'}</Text>
            </View>
            <View style={styles.facepileContainer}>
              {this.state.communityMembers !== [] && (
                <Facepile
                  totalWidth={335}
                  maxNumImages={10}
                  imageDiameter={50}
                  members={communityMembers}
                  pileTitle="Community Members"
                  navigation={this.props.navigation}
                />
              )}
            </View>

            <View style={styles.middleText}>
              <Text style={styles.titleText}>{'coming up'}</Text>
            </View>
            <View style={styles.upcomingScroll}>
              <CommunityProfileEventCardHorizontalScroll
                events={upcomingEvents}
                onPress={this._onPressOpenEventPage}
                interestedIDs={interestedEventDocIds}
                goingIDs={goingEventDocIds}
              />
            </View>
            <View style={styles.bottomText}>
              <Text style={styles.titleText}>{"how we've helped"}</Text>
              <View style={styles.pastScroll}>
                <CommunityProfileEventCardHorizontalScroll
                  events={pastEvents}
                  onPress={this._onPressOpenEventPage}
                  interestedIDs={interestedEventDocIds}
                  goingIDs={goingEventDocIds}
                />
              </View>
            </View>
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
  titleText: {
    fontFamily: 'montserrat',
    fontSize: 19,
    color: 'black',
    left: 19,
  },
  topText: {
    top: -85,
  },
  facepileContainer: {
    left: 19,
    top: -80,
  },
  middleText: {
    top: -65,
  },
  bottomText: {
    top: -50,
  },
  placeholder: {
    width: 335,
    height: 50,
    backgroundColor: 'grey',
    left: 19,
    top: -42,
  },
  upcomingScroll: {
    left: 15,
    top: -60,
  },
  pastScroll: {
    left: 15,
    top: 7,
    height: 0, //removes extra blank space at bottom of scroll
  },
  activityIndicator: {
    marginTop: 300,
  },
});
