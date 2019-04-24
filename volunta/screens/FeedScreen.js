import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import * as api from '../firebase/api';
import { Constants } from 'expo';
import { EventRowTest } from '../components';

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isRefreshing: false
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

  _renderEventRow = ({ item }) => <EventRowTest {...item} />;

  render() {
    // return null;

    return (
      <View style={myStyles.container}>
        {this.state.events !== [] && (
          <FlatList
            renderItem={this._renderEventRow}
            data={this.state.events}
            onRefresh={() => this._loadEvents()}
            keyExtractor={(_, index) => index.toString()}
            refreshing={this.state.isRefreshing}
          />
        )}
      </View>
    );
  }
}

const myStyles = StyleSheet.create({
  container: {
    padding: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
