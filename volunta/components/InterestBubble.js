import React from 'react';
import {
  StyleSheet,
  Text,
  View,
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
    bubble: {
        backgroundColor:'#0081AF',
        alignSelf: 'flex-start',
        borderRadius: 20
    },
    bubbleText: {
        margin: 8,
        marginHorizontal: 15,
        color: 'white',
        fontFamily: 'montserrat'
    }

});