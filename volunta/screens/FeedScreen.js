import React from 'react';
import { StyleSheet, FlatList, View, Dimensions } from 'react-native';
import { EventCard } from '../components';
import { SearchBar } from 'react-native-elements';
import {
  getEvents,
  getAllUserInterestedEventsDocIds,
  updateUserInterestedEvents
} from '../firebase/api';

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isRefreshing: false,
      search: '',
      interestedEventDocIds: new Set(), // IDs of all events that user is interested on
      userId: 'kgxbnXxwNXKIupPuIrcV', // TODO: pass in as prop
      interestedMap: new Map() // <string, boolean>, tells us if user is interested in eventid
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
  // 1) Detch list of events using api call.
  // 2) Retrieve all events the user is interested in for the interested prop in EventCard
  // TODO: Using hard coded user doc id, make that a constant for now...
  // TODO: show error message in case fetching goes wrong (if anything returns null or error?)...
  _loadData = async () => {
    this.setState({
      isRefreshing: true // Needed for FlatList to know
    });

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

    // Update state and restore refreshing
    this.setState({
      isRefreshing: false,
      events,
      interestedMap
    });
  };

  // Called when user types something into search bar.
  // Right now simply update displayed text.
  _updateSearch = search => {
    this.setState({ search });
  };

  // Function we pass to EventCard, pushes screen onto current stack with the corresponding event page
  _onPressEventCard = event => {
    this.props.navigation.push('Event', {
      event
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
        interested={!!this.state.interestedMap.get(item.doc_id)}
        onClickInterested={this._updateInterested}
      />
    );
  };

  // Function that we pass to the child (EventCard) that should be called when user presses the 'interested' button.
  // We first get try updating the state in the FE.
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
    console.log(success);

    // Toggle back if database update failed.
    if (!success) {
      interestedMap.set(eventId, !interestedMap.get(eventId));
      this.setState({ interestedMap });
    }
  };

  render() {
    const { search, events, isRefreshing } = this.state;
    return (
      <View style={styles.pageContainer}>
        <SearchBar
          placeholder=""
          onChangeText={this._updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchContainerStyle}
          inputContainerStyle={styles.searchInputContainerStyle}
        />
        {events !== [] && (
          <FlatList
            style={styles.flatListStyle}
            renderItem={this._renderEventCard}
            data={events}
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
    width: Dimensions.get('window').width
  },
  searchContainerStyle: {
    backgroundColor: 'white',
    borderWidth: 0, // no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    width: '95%',
    alignSelf: 'center'
  },
  searchInputContainerStyle: {
    backgroundColor: '#E8E8E8'
  },
  flatListStyle: {
    height: '100%'
  }
});
