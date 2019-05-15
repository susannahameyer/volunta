import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class InterestBubble extends React.Component {
  render() {
    const { interestName, onLayout, id, marginRight } = this.props;
    return (
      <View
        style={[styles.bubble, { marginRight: marginRight }]}
        onLayout={e => onLayout(e, id)}
      >
        <Text style={styles.bubbleText}>{interestName}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#0081AF',
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  bubbleText: {
    marginVertical: 7,
    marginHorizontal: 15,
    color: 'white',
    fontFamily: 'montserrat',
  },
});
