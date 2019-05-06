import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default class EventPageButtonBar extends React.Component {
  render() {
    const { interested, going } = this.props;

    return (
      <View style={styles.divider}>
        <View style={styles.container}>
          <View style={styles.iconBlock}>
            <Icon
              name="star-circle-outline"
              size={54}
              color={interested ? Colors.iconBlue : Colors.iconGray}
            />
            <Text
              style={[
                styles.iconLabel,
                { color: interested ? Colors.iconBlue : Colors.iconGray },
              ]}
            >
              {'Interested'}
            </Text>
          </View>
          <View style={styles.iconBlock}>
            <Icon
              name="check-circle-outline"
              size={54}
              color={going ? Colors.iconBlue : Colors.iconGray}
            />
            <Text
              style={[
                styles.iconLabel,
                { color: going ? Colors.iconBlue : Colors.iconGray },
              ]}
            >
              {'Going'}
            </Text>
          </View>
          <View style={styles.iconBlock}>
            <Icon
              name="circle-outline"
              size={57}
              color={Colors.iconGray}
              style={styles.circle}
            />
            <Ionicons
              name="ios-more"
              size={40}
              color={Colors.iconGray}
              style={styles.moreIcon}
            />
            <Text style={[styles.iconLabel, { marginTop: 7 }]}>{'More'}</Text>
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
  },
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
  },
  iconLabel: {
    fontFamily: 'montserrat-bold',
    fontSize: 12,
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
