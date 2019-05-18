import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/*
Interest Bubble Component

Props:
    - interestName: name for bubble
    - marginRight (optional): margin to add next to bubble, used for spacing
    - onLayout (optional): function that takes event and id, called after bubble is rendered, make sure to pass in id if called.
        Used in bubble component to get bubble width
    - id (requiered if onLayout is defined): used for identifying bubble in the list its being used. 
*/
export default class InterestBubble extends React.Component {
  render() {
    const { interestName, marginRight, onLayout, id, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View
          style={[styles.bubble, { marginRight: marginRight }]}
          onLayout={!!onLayout ? e => onLayout(e, id) : null}
        >
          <Text style={styles.bubbleText}>{interestName}</Text>
        </View>
      </TouchableOpacity>
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
