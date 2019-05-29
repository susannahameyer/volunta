import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
  ActionSheetIOS,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { timestampToDate, dateToWords, timestampToTimeOfDay } from '../utils';
import EventPageInterestsScroll from './EventPageInterestsScroll';

/*
This component displays as a section within a single event page to give 
the user logistical event details. Eventually the location may be clickable.

Props:
    - fromDate
    - toDate
    - location
*/

export default class EventPageAboutSection extends React.Component {
  _openMap = (location, eventName) => {
    // Reference: https://stackoverflow.com/questions/43214062/open-maps-google-maps-in-react-native
    let lat = location.coords._lat;
    let lng = location.coords._long;
    if (!!lng && !!lat) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${lat},${lng}`;
      const label = eventName;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
    }
  };

  _onAddressClicked = (location, eventName) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Open in Maps', 'Cancel'],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 1,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this._openMap(location, eventName);
        }
      }
    );
  };

  render() {
    const { fromDate, toDate, location, interests, eventName } = this.props;
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
          <Text style={styles.aboutText}>{'about'}</Text>
          <View style={styles.aboutInfo}>
            <Ionicons
              name="ios-calendar"
              size={20}
              color={Colors.aboutIconGray}
            />
            <Text style={styles.aboutInfoText}>{dateFormatted}</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Ionicons name="ios-clock" size={20} color={Colors.aboutIconGray} />
            <Text style={styles.aboutInfoText}>{timeFormatted}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this._onAddressClicked(location, eventName)}
          >
            <View style={styles.aboutInfo}>
              <Ionicons
                name="ios-pin"
                size={20}
                style={styles.pin}
                color={Colors.aboutIconGray}
              />
              <Text style={styles.aboutInfoText}>{addressFormatted}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.interests}>
            <EventPageInterestsScroll interests={interests} />
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
    // marginHorizontal: 20,
    marginVertical: 10,
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'raleway-medium',
    marginBottom: 8,
  },
  aboutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 70,
    marginBottom: 5,
    marginLeft: 5,
  },
  aboutInfoText: {
    fontSize: 14,
    fontFamily: 'raleway',
    marginLeft: 15,
  },
  pin: {
    marginLeft: 2,
  },
  interests: {
    marginTop: 5,
  },
});
