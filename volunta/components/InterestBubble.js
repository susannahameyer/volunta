import React from 'react';
import { Icon, Font, LinearGradient } from 'expo';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

export default class InterestBubble extends React.Component {
  render() {
    const {interestName} = this.props
    return (
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{interestName}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    bubble: {
        color:'blue'
    },
    bubbleText: {
        color: 'white',
        fontFamily: 'montserrat'
    }
  },
});