import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EventCardConstants from '../constants/EventCardConstants';

export default class EventCard extends React.Component {
  //This will be changed once the database is completely connected
  // and we actually know what needs to be stored here
  // FYI copying props into state is bad practice but fine for now
  // since we won't be using this long term
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      coverPhoto: props.coverPhoto,
      organization: props.organization,
      date: props.date,
      distance: props.distance,
      numAttendees: props.numAttendees,
      bookmarked: false
    };
  }

  _bookmarkEvent = () => {
    this.setState({
      bookmarked: !this.state.bookmarked
    });
  };

  render() {
    return (
      <View style={styles.shadow}>
        <TouchableOpacity style={styles.cardContainer}>
          <View style={styles.shadow}>
            <Image source={this.state.coverPhoto} style={styles.coverPhoto} />
            <Icon
              name="star-circle-outline"
              size={45}
              style={styles.bookmarkIcon}
              onPress={this._bookmarkEvent}
              color={this.state.bookmarked ? '#0081AF' : 'grey'}
            />

            <View style={styles.textContainer}>
              <View style={styles.titleTextContainer}>
                <Text style={styles.titleText}>{this.state.title}</Text>
                <Text style={styles.detailText}>{this.state.organization}</Text>
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailText}>{this.state.date}</Text>
                <Text style={styles.detailText}>{this.state.distance} mi</Text>
                <Text style={styles.detailText}>
                  {this.state.numAttendees} going
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    height: EventCardConstants.cardHeight,
    width: EventCardConstants.cardWidth,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    overflow: 'hidden'
  },
  coverPhoto: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  shadow: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#0000' // invisible color
  },
  titleText: {
    fontFamily: 'montserrat',
    fontSize: 20,
    fontWeight: 'normal',
    paddingBottom: 5
  },
  detailText: {
    fontFamily: 'montserrat',
    fontSize: 14,
    fontWeight: 'normal',
    color: '#838383'
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  titleTextContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 13
  },
  detailTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 13
  },
  bookmarkIcon: {
    position: 'absolute',
    left: EventCardConstants.cardWidth - 45,
    bottom: EventCardConstants.cardHeight / 2
  }
});
