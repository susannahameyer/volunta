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
} from 'react-native';
import Facepile from '../components/Facepile';
import ProfilePageInterests from '../components/ProfilePageInterests';
import ExpandableInterests from '../components/ExpandableInterests';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  getEventsForCommunity,
  getAllUserInterestedEventsDocIds,
  getUsersAttributes,
} from '../firebase/api';
import { firestore } from '../firebase/firebase';
import * as c from '../firebase/fb_constants';
import * as firebase from 'firebase';

const SIDE_MARGIN = 20;

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: [],
      pastEvents: [],
      volunteerNetwork: [],
      interestedEventDocIds: new Set(),
      refreshing: true,
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  //TODO: change this to be profile-specific and consolidate profile/community logic in a shared space
  _loadData = async () => {
    const [
      upcomingEvents,
      pastEvents,
      ongoingEvents,
    ] = await getEventsForCommunity();

    //If we are navigating to another user's profile
    const userId = this.props.navigation.getParam('userId', c.TEST_USER_ID);

    // Get doc IDs the current user has bookmarked
    const interestedEventDocIds = await getAllUserInterestedEventsDocIds(
      userId
    );

    //TODO change this to actual volunteer network
    const volunteerNetwork = await firestore
      .collection('users')
      .get()
      .then(
        async snapshot =>
          await getUsersAttributes(snapshot.docs, ['name', 'profile_pic_url'])
      );

    this.setState({
      upcomingEvents,
      pastEvents,
      interestedEventDocIds,
      refreshing: false,
      volunteerNetwork,
      userId,
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

  render() {
    const {
      upcomingEvents,
      pastEvents,
      interestedEventDocIds,
      refreshing,
    } = this.state;

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
              source={require('../assets/images/kanye.png')}
            />
            <View style={styles.upperText}>
              <Text style={styles.personName}>Kanye West</Text>
              <Text style={styles.communityName}>Stanford University</Text>
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
            <ExpandableInterests
              duration={500}
              numRows={2}
              accordionRight={true}
            />
          </View>
          <View style={styles.comingUpBar}>
            <Text style={styles.sectionTitle}>coming up:</Text>
            <View style={styles.upcomingScroll}>
              <CommunityProfileEventCardHorizontalScroll
                events={upcomingEvents}
                interestedIDs={interestedEventDocIds}
                onPress={this._onPressOpenEventPage}
              />
            </View>
          </View>
          <View style={styles.helpedBar}>
            <Text style={styles.helpedTitle}>how I've helped:</Text>
            <CommunityProfileEventCardHorizontalScroll
              events={pastEvents}
              interestedIDs={interestedEventDocIds}
              onPress={this._onPressOpenEventPage}
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
});
