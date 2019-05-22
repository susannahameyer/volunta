import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { timestampToDate } from '../utils';
import { getOrganizationName } from '../firebase/api';
import Colors from '../constants/Colors';
import AssetFilePaths from '../constants/AssetFilePaths';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class CommunityProfileEventCard extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      org_name: '',
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    if (!!this.props.event) {
      let org_name = await getOrganizationName(this.props.event.org_ref);
      let date = timestampToDate(this.props.event.from_date);

      if (this._isMounted) {
        this.setState({
          date,
          org_name,
        });
      }
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  render() {
    const { event, interested, going, onPress, status, source } = this.props;
    const upcoming = status == 'upcoming';
    if (!!event == false) {
      // Don't show empty event cards for empty past events
      if (!upcoming) {
        return null;
      }
      var displayText = '';
      if (source == 'profile') {
        displayText =
          'You currently have no upcoming events. Browse the Feed to join in!';
      } else if (source == 'community') {
        displayText = 'Your community currently has no upcoming events.';
      }
      return (
        <View style={styles.shadow}>
          <TouchableOpacity
            style={[styles.cardContainer, { height: 153 }]}
            onPress={() => onPress(event, org_name, interested)}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.emptyPhotoContainer}>
                <Image
                  source={AssetFilePaths.flower}
                  style={styles.emptyPhoto}
                />
              </View>
              <View style={styles.textContainer}>
                <View style={styles.emptyTextContainer}>
                  <Text style={styles.emptyText}>{displayText}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    const { date, org_name } = this.state;
    return (
      <View style={styles.shadow}>
        {/* if the event is in the past list, make the height shorter */}
        <TouchableOpacity
          style={[styles.cardContainer, { height: upcoming ? 153 : 118 }]}
          onPress={() => onPress(event, org_name, interested)}
        >
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: event.cover_url }}
              style={styles.coverPhoto}
            />
            <View style={styles.textContainer}>
              <View style={styles.titleTextContainer}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.detailText} numberOfLines={1}>
                  {org_name}
                </Text>
              </View>
              <View
                style={
                  upcoming
                    ? styles.detailTextContainer
                    : styles.smallDetailTextContainer
                }
              >
                <Text style={styles.dateText}>{date}</Text>
                <Icon
                  name={'check-circle-outline'}
                  size={23}
                  color={going ? Colors.iconBlue : 'grey'}
                />
                <Icon
                  name={'star-circle-outline'}
                  size={23}
                  style={styles.bookmarkIcon}
                  color={interested ? Colors.iconBlue : 'grey'}
                />
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
    width: 181,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 4,
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
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#0000', // invisible color
  },
  titleText: {
    fontFamily: 'raleway',
    fontSize: 17,
  },
  detailText: {
    fontFamily: 'raleway',
    fontSize: 14,
    fontWeight: 'normal',
    color: '#838383',
  },
  dateText: {
    fontFamily: 'raleway',
    fontSize: 14,
    fontWeight: 'normal',
    color: '#838383',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleTextContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 5,
  },
  bookmarkIcon: {
    paddingRight: 3,
  },
  detailTextContainer: {
    marginLeft: 10,
    flexDirection: 'row',
  },
  smallDetailTextContainer: {
    height: 0,
    width: 0,
  },
  emptyPhoto: {
    width: '80%',
    height: '80%',
  },
  emptyTextContainer: {
    top: -25,
    position: 'absolute',
    backgroundColor: '#F8F8F8',
    height: 55,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'montserrat',
    fontSize: 12,
    marginLeft: 3,
    textAlign: 'center',
  },
  emptyPhotoContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
});
