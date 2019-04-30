import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Facepile from '../components/Facepile';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';
import { getEventsForCommunity } from '../firebase/api';

export default class CommunityScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: [],
      pastEvents: [],
    };
  }

  static navigationOptions = {
    title: 'Community',
  };

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const [upcomingEvents, pastEvents] = await getEventsForCommunity();
    this.setState({
      upcomingEvents: upcomingEvents,
      pastEvents: pastEvents
    });
  };

  render() {
    const { upcomingEvents, pastEvents } = this.state;

    return (
      <View>
        <CommunityCoverPhoto communityPhoto={'https://i.imgur.com/Es0yqyh.png'} communityName={'Stanford Community'}/>
          <View style={styles.topText}>
            <Text style={styles.titleText}>
              {'in my community'}
            </Text>
          </View>
          <View style={styles.facepileContainer}>
            <Facepile
              totalWidth={335}
              maxNumImages={10}
              imageDiameter={50}
              />
          </View>
          
          <View style={styles.middleText}>
            <Text style={styles.titleText}>
              {'coming up'}
            </Text>
          </View>
          <View style={styles.upcomingScroll}>
            <CommunityProfileEventCardHorizontalScroll events={upcomingEvents} />
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.titleText}>
              {'how we\'ve helped'}
            </Text>
            <View style={styles.pastScroll}>
              <CommunityProfileEventCardHorizontalScroll events={pastEvents} />
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
  }
});
