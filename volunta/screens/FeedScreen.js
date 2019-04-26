import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import * as api from '../firebase/api';
import { EventCard } from '../components';
import { SearchBar } from 'react-native-elements';

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isRefreshing: false,
      search: ''
    };
  }

  // Set title of screen
  static navigationOptions = {
    title: 'Feed'
  };

  // Fetch any data needed from api
  async componentDidMount() {
    this._loadEvents();
  }

  // Set refreshing to false (for FlatList to know) and fetch events using api call.
  _loadEvents = async () => {
    this.setState({
      isRefreshing: true
    });
    const events = await api.getEvents();
    this.setState({
      isRefreshing: false,
      events: events
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
    this.props.navigation.push('Event', { event });
  };

  _renderEventCard = ({ item }) => {
    return (
      <EventCard
        event={item}
        navigation={this.props.navigation}
        onPress={this._onPressEventCard}
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
