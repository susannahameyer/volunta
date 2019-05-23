import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncImage from './AsyncImage';
import EventCardConstants from '../constants/EventCardConstants';
import { getOrganizationName } from '../firebase/api';
import { timestampToDate } from '../utils';

export default class EventCard extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      org_name: '',
    };
  }

  // Fetch data here
  async componentDidMount() {
    this._isMounted = true;
    let org_name = await getOrganizationName(this.props.event.org_ref);
    let date = timestampToDate(this.props.event.from_date);

    if (this._isMounted) {
      this.setState({
        date,
        org_name,
      });
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  render() {
    const {
      event,
      interested,
      onPress,
      onClickInterested,
      distance,
    } = this.props;
    const { org_name, date } = this.state;
    return (
      <View style={styles.shadow}>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => onPress(event, org_name, interested)}
        >
          <View style={styles.coverPhoto}>
            <AsyncImage
              viewStyle={styles.coverPhoto}
              source={{
                uri: event.cover_url,
              }}
              placeholderColor="#E8E8E8"
            />

            <Icon
              name="circle"
              size={45}
              style={styles.interestedIcon}
              color={'white'}
            />
            <Icon
              name="star-circle-outline"
              size={45}
              style={styles.interestedIcon}
              onPress={() => onClickInterested(event.doc_id)}
              color={interested ? '#0081AF' : 'grey'}
            />
          </View>

          <View style={styles.textContainer}>
            <View style={styles.titleTextContainer}>
              <Text numberOfLines={2} style={styles.titleText}>
                {event.title}
              </Text>
              <Text style={styles.detailText} numberOfLines={1}>
                {org_name}
              </Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailText}>{date}</Text>
              {distance !== '' && (
                <Text style={styles.detailText}>{distance}</Text>
              )}
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
    borderRadius: EventCardConstants.borderRadius,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverPhoto: {
    height: EventCardConstants.coverPhotoHeight,
    width: '100%',
    borderTopLeftRadius: EventCardConstants.borderRadius,
    borderTopRightRadius: EventCardConstants.borderRadius,
  },
  shadow: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    backgroundColor: '#0000', // invisible color
  },
  titleText: {
    fontFamily: 'raleway-medium',
    fontSize: 20,
    fontWeight: 'normal',
    paddingBottom: 3,
  },
  detailText: {
    fontFamily: 'raleway',
    fontSize: EventCardConstants.detailsFontSize,
    fontWeight: 'normal',
    color: '#838383',
    paddingBottom: 3,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleTextContainer: {
    flex: 3,
    justifyContent: 'center',
    marginLeft: 13,
  },
  detailTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 13,
  },
  interestedIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
});
