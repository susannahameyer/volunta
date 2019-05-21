import React from 'react';
import {
  ActionSheetIOS,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Facepile from '../components/Facepile';
import ExpandableInterests from '../components/ExpandableInterests';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getAllUserInterestedEventsDocIds,
  getUsersAttributes,
  getUserInterestNames,
  getEventsForProfile,
  getProfilePhoto,
  getProfileName,
  getProfileCommunityName,
  getAllUserGoingEventsDocIds,
  getVolunteerNetwork,
} from '../firebase/api';
import { firestore } from '../firebase/firebase';
import * as c from '../firebase/fb_constants';
import * as firebase from 'firebase';

const SIDE_MARGIN = 20;

export default class ProfileScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: [],
      pastEvents: [],
      volunteerNetwork: [],
      interestedEventDocIds: new Set(),
      goingEventDocIds: new Set(),
      refreshing: true,
      interests: [],
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    this._loadData();
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  //TODO: change this to be profile-specific and consolidate profile/community logic in a shared space
  _loadData = async () => {
    // If we are navigating to another user's profile
    // TODO: Change default to current user
    let _userId = await firebase.auth().currentUser.uid;
    const userId = this.props.navigation.getParam('userId', _userId);
    const [
      [upcomingEvents, pastEvents, ongoingEvents],
      interests,
      // get name of user
      profileName,

      // Get doc IDs the current user has bookmarked and is going to
      interestedEventDocIds,
      goingEventDocIds,

      // get url for profile picture
      profilePhoto,
      // get community name for a profile
      communityName,
    ] = await Promise.all([
      getEventsForProfile(userId),
      getUserInterestNames(userId),
      getProfileName(userId),
      getAllUserInterestedEventsDocIds(userId),
      getAllUserGoingEventsDocIds(userId),
      getProfilePhoto(userId),
      getProfileCommunityName(userId),
    ]);

    // get the volunteer network from the past events
    const volunteerNetwork = await getVolunteerNetwork(pastEvents);

    if (this._isMounted) {
      this.setState({
        upcomingEvents,
        pastEvents,
        profileName,
        profilePhoto,
        communityName,
        volunteerNetwork,
        interestedEventDocIds,
        goingEventDocIds,
        refreshing: false,
        interests,
      });
    }
  };

  // onPress function to pass to CommunityProfileEventCards using screen navigation
  _onPressOpenEventPage = (event, org_name, interested) => {
    this.props.navigation.push('Event', {
      event,
      org_name,
      interested,
    });
  };

  _onPressSettings = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Logout', 'Edit Profile'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          // TODO: cancel all promises, since once we sign out we should not be able to setState
          firebase.auth().signOut();
        }
      }
    );
  };

  render() {
    const {
      upcomingEvents,
      pastEvents,
      interestedEventDocIds,
      goingEventDocIds,
      refreshing,
      interests,
      mounted,
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
          <View style={styles.container}>
            <View style={styles.profileBar}>
              <Image
                style={styles.profilePic}
                source={{ uri: this.state.profilePhoto }}
              />
              <View style={styles.upperText}>
                <Text style={styles.personName}>{this.state.profileName}</Text>
                <Text style={styles.communityName}>
                  {this.state.communityName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={this._onPressSettings}
                style={styles.editIcon}
              >
                <Ionicons name="ios-settings" size={30} color="#0081AF" />
              </TouchableOpacity>
            </View>
            <View style={styles.interestBar}>
              <Text style={styles.sectionTitle}>interests:</Text>
              {interests.length > 0 && (
                <ExpandableInterests
                  interests={interests} // TODO: component seems to be rendering only on first attempt!
                  duration={500}
                  numRows={2}
                  accordionRight={true}
                />
              )}
            </View>
            <View style={styles.comingUpBar}>
              <Text style={styles.sectionTitle}>coming up:</Text>
              <View style={styles.upcomingScroll}>
                <CommunityProfileEventCardHorizontalScroll
                  events={upcomingEvents}
                  interestedIDs={interestedEventDocIds}
                  onPress={this._onPressOpenEventPage}
                  goingIDs={goingEventDocIds}
                />
              </View>
            </View>
            <View style={styles.helpedBar}>
              <Text style={styles.helpedTitle}>how I've helped:</Text>
              <CommunityProfileEventCardHorizontalScroll
                events={pastEvents}
                interestedIDs={interestedEventDocIds}
                onPress={this._onPressOpenEventPage}
                goingIDs={goingEventDocIds}
              />
            </View>
            <View>
              <Text style={styles.sectionTitle}>volunteer network:</Text>
            </View>
            <View style={styles.facepileContainer}>
              {this.state.volunteerNetwork !== [] && (
                <Facepile
                  totalWidth={335}
                  maxNumImages={10}
                  imageDiameter={50}
                  navigation={this.props.navigation}
                  members={this.state.volunteerNetwork}
                  pileTitle="Volunteer Network"
                />
              )}
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
  container: {
    marginHorizontal: SIDE_MARGIN,
  },
  profileBar: {
    flexDirection: 'row',
  },
  editIcon: {
    marginLeft: 35,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'montserrat',
  },
  helpedTitle: {
    fontSize: 20,
    fontFamily: 'montserrat',
    marginBottom: 8,
  },
  profilePic: {
    width: 78,
    height: 78,
    borderRadius: 39,
    marginRight: 20,
    marginBottom: 8,
    marginTop: 10,
  },
  upperText: {
    justifyContent: 'center',
    width: 175,
  },
  interestBar: {
    flex: 1,
  },
  personName: {
    fontSize: 28,
    fontFamily: 'montserrat',
  },
  communityName: {
    fontSize: 16,
    color: '#838383',
    fontFamily: 'montserrat',
  },
  comingUpBar: {
    height: 200,
  },
  upcomingScroll: {
    marginTop: 8,
  },
  helpedBar: {
    height: 160,
  },
  placeholder: {
    width: 335,
    height: 50,
    marginTop: 4,
    backgroundColor: 'grey',
  },
  activityIndicator: {
    marginTop: 300,
  },
});
