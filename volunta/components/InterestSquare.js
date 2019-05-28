import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/*
Interest Square Component used in NUXInterestsScreen

Props:
    - interestName: name for interest
    - updateParentInterestsMap: function to update NUXInterestsScreen state map
*/
export default class InterestSquare extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  _onPressInterest = () => {
    const prevSelected = this.state.selected;
    this.setState({
      selected: !prevSelected,
    });
    this.props.updateParentInterestsMap(this.props.interestName, !prevSelected);
  };

  render() {
    const { interestName } = this.props;
    const { selected } = this.state;
    return (
      <TouchableOpacity
        style={styles.separator}
        onPress={this._onPressInterest}
      >
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
    fontFamily: 'raleway',
    fontSize: 14,
  },
  separator: {
    marginRight: 10,
    marginLeft: 10,
  },
});
