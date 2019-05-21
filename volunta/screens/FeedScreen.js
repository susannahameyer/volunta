import React from 'react';
import { StyleSheet, FlatList, View, Dimensions, TouchableOpacity, Button } from 'react-native';
import { EventCard } from '../components';
import { SearchBar } from 'react-native-elements';
import * as c from '../firebase/fb_constants';
import { DefaultDict, distance, formatDist } from '../utils';
import { Location, Haptic } from 'expo';
import {
  getFeedEvents,
  getAllUserInterestedEventsDocIds,
  updateUserInterestedEvents,
  getNumGoingForAllEvents,
} from '../firebase/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default class FeedScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      displayedEvents: [],
      isRefreshing: true,
      search: '',
      userId: c.TEST_USER_ID, // TODO: pass in as prop
      interestedMap: new Map(), // <string, boolean>, tells us if user is interested in eventid
      goingCounts: new DefaultDict(0), // <eventId, numGoing>
      location: false, // Initialize to false, then update to location object
      currDistance: this.props.navigation.getParam('currDistance', 10), // maximum distance for events
      currInterests: this.props.navigation.getParam('currInterests', []) // list of interests to filter on
    };
  }

  // Fetch any data needed from api
  async componentDidMount() {
    this._isMounted = true;
    this._loadData();
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  // Load data needed for the screen and its components
  // 1) Fetch list of events using api call.
  // 2) Retrieve all events the user is interested in for the interested prop in EventCard
  // TODO: Using hard coded user doc id, make that a constant for now...
  // TODO: show error message in case fetching goes wrong (if anything returns null or error?)...
  _loadData = async () => {
    let interestedMap = new Map();

    const [_, __, events, goingCounts] = await Promise.all([
      this._askPermissionAsync(), // Get location data

      // Fetch event doc ids that user is interested on and set them to true in the map
      getAllUserInterestedEventsDocIds(
        this.state.userId // TODO: make user id a prop
      ).then(event_doc_ids => {
        event_doc_ids.forEach(event_doc_id => {
          interestedMap.set(event_doc_id, true);
        });
      }),

      // Fetch all event objects into array and initialize interestedMap to all false
      getFeedEvents(),
      getNumGoingForAllEvents(),
    ]);

    // Update state and restore refreshing
    // this.searchBar.clear(); // Clear search bar on refresh, simple UX
    if (this._isMounted) {
      this.setState({
        isRefreshing: false,
        events,
        interestedMap,
        goingCounts,
      });

      // Enable refresh while searching
      if (!this.state.search) {
        this.setState({
          displayedEvents: events,
        });
      } else {
        this._updateSearchAndFilter(this.state.search);
      }
    }
  };

  // Called when user types something into search bar.
  // Update displayed text.
  // Filter events by titles that contain the search input.
  _updateSearchAndFilter = search => {
    this.setState({
      search,
      displayedEvents: this.state.events.filter(event =>
        event.title.includes(search)
      ),
    });
  };

  // Function we pass to EventCard, pushes screen onto current stack with the corresponding event page
  _onPressEventCard = (event, org_name, interested) => {
    this.props.navigation.push('Event', {
      event,
      org_name,
      interested,
    });
  };

  // opens advanced search and passes current distance and interests
  _onPressAdvancedSearch = (currDistance, currInterests) => {
    this.props.navigation.push('SearchFilter', {
      currDistance, 
      currInterests,
      onAdvancedSearchPressed: this._refreshResults,
    });
  };

  // gets back the distance and the interests from advanced search screen
  // updating both local state and navigation state so the advanced search
  // screen data can persist
  _refreshResults = data => {
    this.state.currDistance = data[0];
    this.props.navigation.setParams({currDistance: data[0]});
    this.state.currInterests = data[1];
    this.props.navigation.setParams({currInterests: data[1]});
  }

  // Not explicit used now but will potentially be.
  _keyExtractor = (item, index) => item.doc_id;

  // Get distance between user and event
  // Returns a formatted string with the respective sign.
  // TODO: only do this if permission has been granted! (location not false)
  _getDistance = eventCoords => {
    if (!!this.state.location) {
      userCoords = this.state.location.coords;
      const dist = distance(
        userCoords.latitude,
        userCoords.longitude,
        eventCoords._lat,
        eventCoords._long,
        'M' // unit: miles
      );
      return formatDist(dist, 'mi', 1); // mi: abbreviation for miles, 1: decimal places
    } else {
      return '';
    }
  };

  // Render card. The 'item' is an event object. Must be named item for function to work.
  _renderEventCard = ({ item }) => {
    return (
      <EventCard
        id={item.doc_id}
        event={item}
        onPress={this._onPressEventCard}
        interested={this.state.interestedMap.get(item.doc_id)}
        onClickInterested={this._updateInterested}
        numGoing={this.state.goingCounts[item.doc_id]}
        distance={this._getDistance(item.location.coords)}
      />
    );
  };

  // Function that we pass to the child (EventCard) that should be called when user presses the 'interested' button.
  // We first get try updating the state in the Front End.
  // Then we try updating in the database. If the update fails we toggle it back.
  // Otherwise we toggle
  _updateInterested = async eventId => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
    if (this._isMounted) {
      // copy the map rather than modifying state
      const interestedMap = new Map(this.state.interestedMap);

      // Toggle button in FE
      interestedMap.set(eventId, !interestedMap.get(eventId));
      this.setState({ interestedMap });
    }

    // Try to update in database.
    interested = !this.state.interestedMap.get(eventId);
    success = await updateUserInterestedEvents(
      this.state.userId,
      eventId,
      interested
    );

    if (this._isMounted) {
      // Toggle back if database update failed.
      if (!success) {
        interestedMap.set(eventId, !interestedMap.get(eventId));
        this.setState({ interestedMap });
      }
    }
  };

  /**
   * Ask for location permissions if the user has not been asked yet.
   * TODO: Get location before Feed mounts, its too slow right now.
   * Also sets the location state variable.
   */
  _askPermissionAsync = async () => {
    const { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.LOCATION
    );
    if (status != 'granted') {
      console.log('PERMISSION NOT GRANTED!');
    } else {
      const location = await Expo.Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (this._isMounted) {
        this.setState({ location });
      }
    }
  };

  render() {
    const { search, displayedEvents, isRefreshing, currDistance, currInterests } = this.state;
    return (
      <View style={styles.pageContainer}>
        <View>
        <SearchBar
          placeholder="Search for service events"
          onChangeText={this._updateSearchAndFilter}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchContainerStyle}
          inputContainerStyle={styles.searchInputContainerStyle}
          ref={searchBar => (this.searchBar = searchBar)}
        />
        <TouchableOpacity 
          style={styles.filterIcon}
          onPress={() => this._onPressAdvancedSearch(currDistance, currInterests)}
        >
          <FontAwesome name="bars" size={20} style={{ color: 'gray' }} />
        </TouchableOpacity>
        </View>
        {displayedEvents !== [] && (
          <FlatList
            style={styles.flatListStyle}
            renderItem={this._renderEventCard}
            data={displayedEvents}
            extraData={this.state} // Needed for child to update when 'interested' changes
            onRefresh={() => this._loadData()}
            keyExtractor={this._keyExtractor}
            refreshing={isRefreshing}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  searchContainerStyle: {
    backgroundColor: 'white',
    borderWidth: 0, // no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '95%',
    alignSelf: 'center',
  },
  searchInputContainerStyle: {
    backgroundColor: '#E8E8E8',
  },
  flatListStyle: {
    height: '100%',
  },
  filterIcon: {
    position: 'absolute',
    left: '87%',
    top: 19
  }
});
