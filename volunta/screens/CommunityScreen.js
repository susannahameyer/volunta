import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';
import CommunityEventCard from '../components/CommunityEventCard';

export default class CommunityScreen extends React.Component {
  static navigationOptions = {
    title: 'Community',
  };

  render() {
    return (
      <View>
        <CommunityCoverPhoto communityPhoto={'https://i.imgur.com/Es0yqyh.png'} communityName={'Stanford Community'}/>
        <View>
          <View style={styles.topText}>
            <Text style={styles.titleText}>
              {'in my community'}
            </Text>
          </View>
          <View style={styles.placeholder}></View>
          <View style={styles.middleText}>
            <Text style={styles.titleText}>
              {'coming up'}
            </Text>
          <View style={styles.cardContainer}>
            <CommunityEventCard
              coverPhoto='https://i.imgur.com/c6JH6uo.jpg'
              title='Volunteer Opportunity'
              organization='Girls Who Code'
              date='6/12/19'
              interested={true}
              comingUp={true}
            />
          </View>
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.titleText}>
              {'how we\'ve helped'}
            </Text>
          </View>
          <View style={styles.cardContainer}>
            <CommunityEventCard
              coverPhoto='https://i.imgur.com/c6JH6uo.jpg'
              title='Volunteer Opportunity'
              organization='Girls Who Code'
              date='6/12/19'
              interested={true}
              comingUp={false}
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
    top: -51,
  },
  middleText: {
    top: -37,
  },
  bottomText: {
    marginTop: 137,
  },
  cardContainer: {
    top: 6,
    left: 19,
  },
  placeholder: {
    width: 335,
    height: 50,
    backgroundColor: 'grey',
    left: 19,
    top: -48,
  }
});
