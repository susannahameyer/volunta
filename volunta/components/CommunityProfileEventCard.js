import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { timestampToDate } from '../utils';
import { getOrganizationName } from '../firebase/api';
import Colors from '../constants/Colors';

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
    const { event, interested, going, onPress } = this.props;
    const { date, org_name } = this.state;
    const upcoming = event.status == 'upcoming';
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
});
