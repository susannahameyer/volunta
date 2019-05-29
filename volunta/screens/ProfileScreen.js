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
  AlertIOS,
  Dimensions,
} from 'react-native';
import Facepile from '../components/Facepile';
import ExpandableInterests from '../components/ExpandableInterests';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getAllUserInterestedEventsDocIds,
  getUserInterestNames,
  getEventsForProfile,
  getUserProperty,
  getProfileName,
  getProfileCommunityName,
  getAllUserGoingEventsDocIds,
  getVolunteerNetwork,
  setUserProfilePicUrl,
} from '../firebase/api';
import { ImagePicker } from 'expo';
import * as firebase from 'firebase';
import { DEFAULT_PROFILE_PIC_URL } from '../constants/Constants';

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
      profilePic: null,
      profilePicIsBase64: null,
      isCurrentUser: false,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    this._loadData();
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  //TODO: consolidate profile/community logic in a shared space.
  _loadData = async () => {
    // If we are navigating to another user's profile
    // TODO: Change default to current user
    let currentUserId = await firebase.auth().currentUser.uid;
    const userId = this.props.navigation.getParam('userId', currentUserId);
    if (userId == currentUserId) {
      this.setState({ isCurrentUser: true });
    }
    const [
      [upcomingEvents, pastEvents, ongoingEvents],
      interests,
      // get name of user
      profileName,

      // Get doc IDs the current user has bookmarked and is going to
      interestedEventDocIds,
      goingEventDocIds,

      // get url for profile picture
      profilePic,
      profilePicIsBase64,
      // get community name for a profile
      communityName,
    ] = await Promise.all([
      getEventsForProfile(userId),
      getUserInterestNames(userId),
      getProfileName(userId),
      getAllUserInterestedEventsDocIds(userId),
      getAllUserGoingEventsDocIds(userId),
      getUserProperty(userId, 'profile_pic_url'),
      getUserProperty(userId, 'profile_pic_is_base64'),
      getProfileCommunityName(userId),
    ]);

    // get the volunteer network from the past events
    const volunteerNetwork = await getVolunteerNetwork(pastEvents);

    if (this._isMounted) {
      this.setState({
        upcomingEvents,
        pastEvents,
        profileName,
        currentUserId,
        profilePic,
        profilePicIsBase64,
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
          firebase.auth().signOut();
        }
      }
    );
  };

  _uploadFromLibrary = async () => {
    const { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.CAMERA_ROLL
    );
    if (status == 'granted') {
      pickerReturn = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.1, // 0: low quality, 1: high quality
        base64: true,
      });
      // pickerReturn : cancelled, [uri, width, height, type]
      if (!pickerReturn.cancelled) {
        await this._onPickerReturn(pickerReturn.base64);
      }
    } else {
      AlertIOS.alert('Please update your camera roll permissions in Settings!');
    }
  };

  _uploadFromCamera = async () => {
    const { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.CAMERA_ROLL,
      Expo.Permissions.CAMERA
    );
    if (status == 'granted') {
      pickerReturn = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.1, // 0: low quality, 1: high quality
        base64: true,
      });
      // pickerReturn : cancelled, [uri, width, height, exif, base64]
      if (!pickerReturn.cancelled) {
        await this._onPickerReturn(pickerReturn.base64);
      }
    } else {
      AlertIOS.alert('Please update your camera permissions in Settings!');
    }
  };

  _onPickerReturn = async base64img => {
    let userId = await firebase.auth().currentUser.uid;
    setUserProfilePicUrl(userId, base64img, true);
    AlertIOS.alert('Looking great! Please refresh the page to see the update.');
  };

  _uploadImageLink = async () => {
    let userId = await firebase.auth().currentUser.uid;
    AlertIOS.prompt('Please make the link works!', null, async url => {
      await setUserProfilePicUrl(userId, url, false).then();
      AlertIOS.alert(
        'Looking great! Please refresh the page to see the update.'
      );
    });
  };

  _restoreDefaultImg = async () => {
    let userId = await firebase.auth().currentUser.uid;
    await setUserProfilePicUrl(userId, DEFAULT_PROFILE_PIC_URL, false).then();
    AlertIOS.alert(
      'Your current image has been removed! Please refresh the page to see the update.'
    );
  };

  _onPressProfilePic = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Cancel',
          'Upload Image Link',
          'Upload From Library',
          'Upload From Camera',
          'Restore Default Image',
        ],
        cancelButtonIndex: 0,
      },
      async buttonIndex => {
        // Camera Roll: ask for permission
        if (buttonIndex === 1) {
          await this._uploadImageLink();
        } else if (buttonIndex === 2) {
          await this._uploadFromLibrary();
        } else if (buttonIndex === 3) {
          await this._uploadFromCamera();
        } else if (buttonIndex === 4) {
          await this._restoreDefaultImg();
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
      profilePic,
      profilePicIsBase64,
      isCurrentUser,
      volunteerNetwork,
      profileName,
      communityName,
    } = this.state;

    const hidePastEvents = pastEvents.length == 0;

    const volunteerNetworkDisplay =
      volunteerNetwork.length == 0 ? { height: 0 } : {};

    if (!refreshing) {
      let img_uri = profilePicIsBase64
        ? `data:image/gif;base64,${profilePic}`
        : profilePic;
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
          <View style={styles.profileBar}>
            <TouchableOpacity
              onPress={this._onPressProfilePic}
              disabled={!isCurrentUser}
            >
              <Image style={styles.profilePic} source={{ uri: img_uri }} />
            </TouchableOpacity>
            <View style={styles.upperText}>
              <Text style={styles.personName}>{profileName}</Text>
              <Text style={styles.communityName}>{communityName}</Text>
            </View>
            <TouchableOpacity
              onPress={this._onPressSettings}
              style={[styles.editIcon, { width: isCurrentUser ? 30 : 0 }]}
            >
              <Ionicons name="ios-settings" size={30} color="#0081AF" />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={styles.interestBar}>
              <Text style={styles.sectionTitle}>interests</Text>
              {interests.length > 0 && (
                <ExpandableInterests
                  interests={interests}
                  duration={500}
                  numRows={2}
                  accordionRight={true}
                />
              )}
            </View>
            <View style={styles.comingUpBar}>
              <Text style={styles.sectionTitle}>coming up</Text>
              <View style={styles.scroll}>
                <CommunityProfileEventCardHorizontalScroll
                  events={upcomingEvents}
                  interestedIDs={interestedEventDocIds}
                  onPress={this._onPressOpenEventPage}
                  goingIDs={goingEventDocIds}
                  status={'upcoming'}
                  source={'profile'}
                />
              </View>
            </View>
            <View style={hidePastEvents ? { height: 0 } : styles.helpedBar}>
              <Text style={styles.sectionTitle}>how I've helped</Text>
              <View style={styles.scroll}>
                <CommunityProfileEventCardHorizontalScroll
                  events={pastEvents}
                  interestedIDs={interestedEventDocIds}
                  onPress={this._onPressOpenEventPage}
                  goingIDs={goingEventDocIds}
                  status={'past'}
                  source={'profile'}
                />
              </View>
            </View>
            <View style={[styles.facepileContainer, volunteerNetworkDisplay]}>
              <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
                volunteer network
              </Text>
              {this.state.volunteerNetwork !== [] && (
                <Facepile
                  totalWidth={335}
                  maxNumImages={10}
                  imageDiameter={50}
                  navigation={this.props.navigation}
                  members={volunteerNetwork}
                  pileTitle="Volunteer Network"
                  currentUserId={this.state.currentUserId}
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
    marginTop: 10,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    borderLeftWidth: 0,

    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    paddingHorizontal: SIDE_MARGIN,
    paddingBottom: 5,
  },
  editIcon: {
    marginLeft: 35,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'raleway-medium',
    marginBottom: 8,
    marginTop: 20,
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
    fontSize: 24,
    fontFamily: 'raleway',
  },
  communityName: {
    fontSize: 14,
    color: '#838383',
    fontFamily: 'raleway',
    marginTop: 4,
  },
  comingUpBar: {
    height: 200,
  },
  scroll: {
    marginTop: 8,
  },
  helpedBar: {
    height: 160,
    marginTop: 20,
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
  facepileContainer: {
    marginTop: 28,
    marginBottom: 10,
  },
});
