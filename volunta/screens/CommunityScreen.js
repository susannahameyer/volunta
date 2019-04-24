import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';
import Faces from '../components/Faces';

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
          <View style={styles.middleText}>
            <Text style={styles.titleText}>
              {'coming up'}
            </Text>
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.titleText}>
              {'how we\'ve helped'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'montserrat',
    fontSize: 20,
    color: 'black',
    left: 19,
  },
  topText: {
    top: -40,
  },
  middleText: {
    marginTop: 40,
  },
  bottomText: {
    marginTop: 130,
  }
});
