import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { EventCard } from '../components';
import { SearchBar } from 'react-native-elements';
import { getEvents, getAllUserInterestedEventsDocIds } from '../firebase/api';

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isRefreshing: false,
      search: '',
      interestedEventDocIds: new Set()
    };
  }

  // Set title of screen
  static navigationOptions = {
    title: 'Feed'
  };

  // Fetch any data needed from api
  async componentDidMount() {
    this._loadData();
  }

  // Set refreshing to false (for FlatList to know and to update state once loaded)
  // and fetch events using api call.
  // Get all events for the feed
  // Retrieve all events the user is interested in for the interested prop in EventCard
  // TODO: Using hard coded user doc id, make that a constant for now...
  _loadData = async () => {
    this.setState({
      isRefreshing: true
    });
    const events = await getEvents();
    const interestedEventDocIds = await getAllUserInterestedEventsDocIds(
      'kgxbnXxwNXKIupPuIrcV'
    );
    this.setState({
      isRefreshing: false,
      events,
      interestedEventDocIds
    });
  };

  componentWillUnmount() {
    // TODO: Cancel async calls to prevent memory leakage
  }

  // Called when user types something into search bar.
  // Right now simply update displayed text.
  _updateSearch = search => {
    this.setState({ search });
  };

  // Function we pass to EventCard, pushes screen onto feed stack with the corresponding event page
  _onPressEventCard = event => {
    this.props.navigation.push('Event', {
      event
    });
  };

  // Render card. The 'item' is an event object. Must be named item for function to work.
  _renderEventCard = ({ item }) => {
    return (
      <EventCard
        event={item}
        onPress={this._onPressEventCard}
        interested={this.state.interestedEventDocIds.has(item.doc_id)}
      />
    );
  };

  render() {
    const { search, events, isRefreshing } = this.state;
    return (
      <View>
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
            onRefresh={() => this._loadEvents()}
            keyExtractor={(_, index) => index.toString()}
            refreshing={isRefreshing}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainerStyle: {
    backgroundColor: 'white',
    borderWidth: 0, // no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginHorizontal: 8
  },
  searchInputContainerStyle: {
    backgroundColor: '#E8E8E8'
  },
  flatListStyle: {
    height: '100%'
  }
});
