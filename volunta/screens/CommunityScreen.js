import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Facepile from '../components/Facepile';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import {
  getEventsForCommunity,
  getCommunityName,
  getCommunityCoverPhoto,
  getUserCommunity,
  getAllUserInterestedEventsDocIds,
} from '../firebase/api';
import * as c from '../firebase/fb_constants';

export default class CommunityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: [],
      pastEvents: [],
      communityPhoto: '',
      communityName: '',
      interestedEventDocIds: new Set(),
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    // Get event data
    const [
      upcomingEvents,
      pastEvents,
      ongoingEvents,
    ] = await getEventsForCommunity();

    // Get current user's community data
    const currentUserCommunityRef = await getUserCommunity(c.TEST_USER_ID);
    const communityName = await getCommunityName(currentUserCommunityRef);
    const communityPhoto = await getCommunityCoverPhoto(
      currentUserCommunityRef
    );

    // Get doc IDs the current user has bookmarked
    const interestedEventDocIds = await getAllUserInterestedEventsDocIds(
      c.TEST_USER_ID
    );

    this.setState({
      upcomingEvents,
      pastEvents,
      communityPhoto,
      communityName,
      interestedEventDocIds,
    });
  };

  render() {
    const {
      upcomingEvents,
      pastEvents,
      communityPhoto,
      communityName,
      interestedEventDocIds,
    } = this.state;

    return (
      <View>
        <CommunityCoverPhoto
          communityPhoto={communityPhoto}
          communityName={communityName}
        />
        <View style={styles.topText}>
          <Text style={styles.titleText}>{'in my community'}</Text>
        </View>
        <View style={styles.facepileContainer}>
          <Facepile totalWidth={335} maxNumImages={10} imageDiameter={50} />
        </View>

        <View style={styles.middleText}>
          <Text style={styles.titleText}>{'coming up'}</Text>
        </View>
        <View style={styles.upcomingScroll}>
          <CommunityProfileEventCardHorizontalScroll
            events={upcomingEvents}
            interestedIDs={interestedEventDocIds}
          />
        </View>
        <View style={styles.bottomText}>
          <Text style={styles.titleText}>{"how we've helped"}</Text>
          <View style={styles.pastScroll}>
            <CommunityProfileEventCardHorizontalScroll
              events={pastEvents}
              interestedIDs={interestedEventDocIds}
            />
          </View>
        </View>
      </View>
    );
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
    top: -44,
  },
  facepileContainer: {
    left: 19,
    top: -42,
  },
  middleText: {
    top: -30,
  },
  bottomText: {
    top: -20,
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
    top: -25,
  },
  pastScroll: {
    left: 15,
    top: 7,
  },
});
