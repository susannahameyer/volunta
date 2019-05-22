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
      numGoing,
      distance,
    } = this.props;
    const { org_name, date } = this.state;
    return (
      <View style={styles.shadow}>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => onPress(event, org_name, interested)}
        >
          <View style={styles.shadow}>
            <AsyncImage
              viewStyle={styles.coverPhoto}
              source={{
                uri: event.cover_url,
              }}
              placeholderColor="#E8E8E8"
            />

            <Icon
              name="circle"
              size={43}
              style={styles.circle}
              color={'white'}
            />
            <Icon
              name="star-circle-outline"
              size={45}
              style={styles.interestedIcon}
              onPress={() => onClickInterested(event.doc_id)}
              color={interested ? '#0081AF' : 'grey'}
            />

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
                <Text style={styles.detailText}>{numGoing} going</Text>
                {distance !== '' && (
                  <Text style={styles.detailText}>{distance}</Text>
                )}
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
    marginBottom: 16,
    marginLeft: 17,
  },
  coverPhoto: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  shadow: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#0000', // invisible color
  },
  titleText: {
    fontFamily: 'montserrat',
    fontSize: 20,
    fontWeight: 'normal',
    paddingBottom: 5,
  },
  detailText: {
    fontFamily: 'montserrat',
    fontSize: 14,
    fontWeight: 'normal',
    color: '#838383',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleTextContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 13,
  },
  detailTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 13,
  },
  interestedIcon: {
    position: 'absolute',
    left: EventCardConstants.cardWidth - 45,
    bottom: EventCardConstants.cardHeight / 2,
  },
  circle: {
    marginLeft: EventCardConstants.cardWidth - 45,
    top: 57,
    position: 'absolute',
  },
});
