import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Facepile from '../components/Facepile';
import InterestBubble from '../components/InterestBubble';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import Feather from '@expo/vector-icons/Feather';
import {
  getEventsForCommunity,
  getAllUserInterestedEventsDocIds,
  getUsersAttributes,
  getEventsForProfile,
} from '../firebase/api';
import { firestore } from '../firebase/firebase';
import * as c from '../firebase/fb_constants';

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
    ] = await getEventsForProfile(c.TEST_USER_ID);

    // Get doc IDs the current user has bookmarked
    const interestedEventDocIds = await getAllUserInterestedEventsDocIds(
      c.TEST_USER_ID
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
            <TouchableOpacity style={styles.editIcon}>
              <Feather name="edit" size={30} color="#0081AF" />
            </TouchableOpacity>
          </View>
          <View style={styles.interestBar}>
            <Text style={styles.sectionTitle}>interests:</Text>
            <View style={styles.singleInterestRow}>
              <InterestBubble interestName={'public health'} />
              <InterestBubble interestName={'kitties'} />
              <InterestBubble interestName={'social good'} />
            </View>
            <View style={styles.singleInterestRow}>
              <InterestBubble interestName={'kids'} />
              <InterestBubble interestName={'environmental'} />
              <InterestBubble interestName={'civics'} />
              <InterestBubble interestName={'...'} />
            </View>
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
    marginHorizontal: 20,
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
  personName: {
    fontSize: 28,
    fontFamily: 'montserrat',
  },
  communityName: {
    fontSize: 16,
    color: '#838383',
    fontFamily: 'montserrat',
  },
  interestBar: {
    height: 100,
  },
  singleInterestRow: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginVertical: 3,
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
