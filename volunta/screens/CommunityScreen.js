import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';

export default class CommunityScreen extends React.Component {
  static navigationOptions = {
    title: 'Community',
  };

  render() {
    return (
      <View>
        <CommunityCoverPhoto communityPhoto={'https://i.imgur.com/Es0yqyh.png'} communityName={'Stanford Community'}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
