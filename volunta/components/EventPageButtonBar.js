import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

/*
This component displays below the header of a single event page with 
buttons for RSVPing to an event ('going'), bookmarking an event ('interested'),
and more options (TBD). The 'going' button is blue if a user is going
to the event and gray otherwise, and 'interested' works the same way.

Props:
    - interested
    - going
*/

export default class EventPageButtonBar extends React.Component {
  render() {
    const { interested, going, onPressInterested, onPressGoing } = this.props;

    return (
      <View style={styles.divider}>
        <View style={styles.container}>
          <View style={styles.iconBlock}>
            <Icon
              name="star-circle-outline"
              size={54}
              color={interested ? Colors.iconBlue : Colors.iconGray}
              onPress={() => onPressInterested()}
            />
            <Text
              style={[
                styles.iconLabel,
                { color: interested ? Colors.iconBlue : Colors.iconGray },
              ]}
            >
              {'interested'}
            </Text>
          </View>
          <View style={styles.iconBlock}>
            <Icon
              name="check-circle-outline"
              size={54}
              color={going ? Colors.iconBlue : Colors.iconGray}
              onPress={() => onPressGoing()}
            />
            <Text
              style={[
                styles.iconLabel,
                { color: going ? Colors.iconBlue : Colors.iconGray },
              ]}
            >
              {'going'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#DADADA',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  container: {
    flexDirection: 'row',
    marginVertical: 14,
    justifyContent: 'space-evenly',
  },
  iconLabel: {
    fontFamily: 'raleway',
    fontSize: 14,
    color: Colors.iconGray,
  },
  iconBlock: {
    width: 70,
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  moreIcon: {
    marginTop: 10,
  },
});
