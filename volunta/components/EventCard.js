import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncImage from './AsyncImage';
import EventCardConstants from '../constants/EventCardConstants';
import { getOrganizationName } from '../firebase/api';

export default class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: this._getBookmarked(),
      loaded: false,
      org_name: ''
    };
  }

  // Fetch data here
  async componentWillMount() {
    this.setState({
      org_name: await getOrganizationName(this.props.event.org_ref)
    });
  }

  // TODO: implement logic to get distance to event from the location (return distance in miles for now)
  _getDistance = () => {
    return 1.2;
  };

  // TODO: implement logic to get number of attendees
  _getNumAttendees = () => {
    return 40;
  };

  // TODO: implement backend logic to get actual bookmarked data.
  _getBookmarked = () => {
    return false;
  };

  // Sets state to bookmarked (user triggered)
  _bookmarkEvent = () => {
    this.setState({
      bookmarked: !this.state.bookmarked
    });
  };

  render() {
    // const { navigate } = this.props.navigation;
    const event = this.props.event;
    return (
      <View style={styles.shadow}>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => this.props.onPress(event)}
        >
          <View style={styles.shadow}>
            <AsyncImage
              viewStyle={styles.coverPhoto}
              source={{
                uri: event.cover_url
              }}
              placeholderColor="#E8E8E8"
            />

            <Icon
              name="star-circle-outline"
              size={45}
              style={styles.bookmarkIcon}
              onPress={this._bookmarkEvent}
              color={this.state.bookmarked ? '#0081AF' : 'grey'}
            />

            <View style={styles.textContainer}>
              <View style={styles.titleTextContainer}>
                <Text style={styles.titleText}>{event.title}</Text>
                <Text style={styles.detailText}>{this.state.org_name}</Text>
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailText}>{event.date}</Text>
                <Text style={styles.detailText}>{this._getDistance()} mi</Text>
                <Text style={styles.detailText}>
                  {this._getNumAttendees()} going
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
    overflow: 'hidden',
    marginBottom: 16
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
