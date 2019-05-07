import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

/*
This component displays as a section within a single event page to give 
the user logistical event details. Eventually the location may be clickable.

Props:
    - fromDate
    - toDate
    - location
*/

export default class EventPageAboutSection extends React.Component {
  render() {
    //TODO: convert timestamp to string date / times and fill in info, hard-coded for now
    const { fromDate, toDate, location } = this.props;
    return (
      <View style={styles.divider}>
        <View style={styles.container}>
          <Text style={styles.aboutText}>{'About'}</Text>
          <View style={styles.aboutInfo}>
            <Ionicons
              name="ios-calendar"
              size={24}
              color={Colors.aboutIconGray}
            />
            <Text style={styles.aboutInfoText}>{'June 20, 2019'}</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Ionicons name="ios-clock" size={24} color={Colors.aboutIconGray} />
            <Text style={styles.aboutInfoText}>{'6:30PM - 9:30PM'}</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Ionicons
              name="ios-pin"
              size={24}
              style={styles.pin}
              color={Colors.aboutIconGray}
            />
            <Text style={styles.aboutInfoText}>
              {'450 Serra Mall, Stanford, CA 94305'}
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
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'montserrat-bold',
    marginBottom: 4,
  },
  aboutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  aboutInfoText: {
    fontSize: 14,
    fontFamily: 'montserrat-medium',
    marginLeft: 15,
  },
  pin: {
    marginLeft: 3,
  },
});
