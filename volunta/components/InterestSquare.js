import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/*
Interest Square Component used in NUXInterestsScreen

Props:
    - interestName: name for interest
    - selected: whether or not the interest is selected
*/
export default class InterestSquare extends React.Component {
  render() {
    const { interestName, selected } = this.props;
    return (
      <TouchableOpacity style={styles.separator}>
        <View
          style={[
            styles.bubble,
            { backgroundColor: selected ? '#0081AF' : '#F2F2F2' },
          ]}
        >
          <Text
            style={[styles.bubbleText, { color: selected ? 'white' : 'black' }]}
          >
            {interestName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    height: 36,
    width: 138,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    marginHorizontal: 15,
    fontFamily: 'montserrat',
    fontSize: 14,
  },
  separator: {
    marginRight: 10,
    marginLeft: 10,
  },
});
