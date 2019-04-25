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

  static navigationOptions = {
    title: 'Notifications'
  };

  async componentDidMount() {
    this._loadEvents();
  }

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

  _updateSearch = search => {
    this.setState({ search });
  };

  _renderEventRow = ({ item }) => <EventCard {...item} />;

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
            renderItem={this._renderEventRow}
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
