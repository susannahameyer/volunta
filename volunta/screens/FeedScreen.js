import React from 'react';
import { StyleSheet, FlatList, View, Dimensions } from 'react-native';
import { EventCard } from '../components';
import { SearchBar } from 'react-native-elements';
import * as c from '../firebase/fb_constants';
import { DefaultDict } from '../utils';
import {
  getEvents,
  getAllUserInterestedEventsDocIds,
  updateUserInterestedEvents,
  getNumGoingForAllEvents,
} from '../firebase/api';

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      displayedEvents: [],
      isRefreshing: true,
      search: '',
      interestedEventDocIds: new Set(), // IDs of all events that user is interested on
      userId: c.TEST_USER_ID, // TODO: pass in as prop
      interestedMap: new Map(), // <string, boolean>, tells us if user is interested in eventid
      goingCounts: new DefaultDict(0), // <eventId, numGoing>
    };
  }

  // Fetch any data needed from api
  async componentDidMount() {
    this._loadData();
  }

  componentWillUnmount() {
    // TODO: Cancel async calls to prevent memory leakage (look into this later..)
  }

  // Load data needed for the screen and its components
  // 1) Fetch list of events using api call.
  // 2) Retrieve all events the user is interested in for the interested prop in EventCard
  // TODO: Using hard coded user doc id, make that a constant for now...
  // TODO: show error message in case fetching goes wrong (if anything returns null or error?)...
  _loadData = async () => {
    // Fetch all event objects into array and initialize interestedMap to all false
    const events = await getEvents();
    let interestedMap = new Map();

    // Fetch event doc ids that user is interested on and set them to true in the map
    await getAllUserInterestedEventsDocIds(
      this.state.userId // TODO: make user id a prop
    ).then(event_doc_ids => {
      event_doc_ids.forEach(event_doc_id => {
        interestedMap.set(event_doc_id, true);
      });
    });

    let goingCounts = await getNumGoingForAllEvents();

    // Update state and restore refreshing
    // this.searchBar.clear(); // Clear search bar on refresh, simple UX
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
  _onPressEventCard = event => {
    this.props.navigation.push('Event', {
      event,
    });
  };

  // Not explicit used now but will potentially be.
  _keyExtractor = (item, index) => item.doc_id;

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
      />
    );
  };

  // Function that we pass to the child (EventCard) that should be called when user presses the 'interested' button.
  // We first get try updating the state in the Front End.
  // Then we try updating in the database. If the update fails we toggle it back.
  // Otherwise we toggle
  _updateInterested = async eventId => {
    // copy the map rather than modifying state
    const interestedMap = new Map(this.state.interestedMap);

    // Toggle button in FE
    interestedMap.set(eventId, !interestedMap.get(eventId));
    this.setState({ interestedMap });

    // Try to update in database.
    interested = !this.state.interestedMap.get(eventId);
    success = await updateUserInterestedEvents(
      this.state.userId,
      eventId,
      interested
    );

    // Toggle back if database update failed.
    if (!success) {
      interestedMap.set(eventId, !interestedMap.get(eventId));
      this.setState({ interestedMap });
    }
  };

  render() {
    const { search, displayedEvents, isRefreshing } = this.state;
    return (
      <View style={styles.pageContainer}>
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
});
