import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { timestampToDate, dateToWords, timestampToTimeOfDay } from '../utils';

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
    const { fromDate, toDate, location } = this.props;
    const dateFormatted = dateToWords(timestampToDate(fromDate));
    const timeFormatted =
      timestampToTimeOfDay(fromDate) + '  -  ' + timestampToTimeOfDay(toDate);
    const addressFormatted =
      location.street_addr +
      ', ' +
      location.city +
      ', ' +
      location.state +
      ', ' +
      location.zip_code;

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
            <Text style={styles.aboutInfoText}>{dateFormatted}</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Ionicons name="ios-clock" size={24} color={Colors.aboutIconGray} />
            <Text style={styles.aboutInfoText}>{timeFormatted}</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Ionicons
              name="ios-pin"
              size={24}
              style={styles.pin}
              color={Colors.aboutIconGray}
            />
            <Text style={styles.aboutInfoText}>{addressFormatted}</Text>
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
    width: Dimensions.get('window').width - 70,
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
