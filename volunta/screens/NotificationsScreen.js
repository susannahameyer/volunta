import React from 'react';
import {
  StyleSheet,
  View,
  FlatList, 
} from 'react-native';
import SingleNotification from '../components/SingleNotification';
import Swipeout from 'react-native-swipeout';

export default class NotificationsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: [
        {id: '0', orgName: 'Girls Who Code', orgPhoto: 'https://i.imgur.com/VuKnN5P.jpg', message: 'Remember to come 10 minutes early to set up one of the workstations!', timeAsStr: '2h' },
        {id: '1', orgName: 'Lion\'s Club', orgPhoto: 'https://i.imgur.com/PZB82WT.jpg', message: 'The cookie baking contest has been postponed until Saturday.', timeAsStr: '10h' },
        {id: '2', orgName: 'Beach Cleanup', orgPhoto: 'https://i.imgur.com/C6PL9tB.jpg', message: 'The weather is going to be perfect! Bring sunscreen and a hat.', timeAsStr: '5d' },
        {id: '3', orgName: 'Community Culture', orgPhoto: 'https://i.imgur.com/9ncYySC.jpg', message: 'Please sign up for a dish at the potluck after registering!', timeAsStr: '2w' },
        {id: '4', orgName: 'Language Coalition', orgPhoto: 'https://i.imgur.com/miTs6v8.jpg', message: 'The lunch will be postponed by half an hour!', timeAsStr: '3w' },
        {id: '5', orgName: 'Homeless March', orgPhoto: 'https://i.imgur.com/u7BFAQ7.jpg', message: 'Get your best running shoes on because we are marching!', timeAsStr: '3w' },
      ],
      search: '',
    };
  }

  _keyExtractor = (item, index) => item.id;

  muteItem = (id) => {
    console.log('put muting database logic here')
  }

  deleteItem = (id) => {
    this.setState({
     notifications: this.state.notifications.filter(item => item.id !== id)
    });
  }

  _renderSingleNotification = ({ item }) => {
    var swipeoutBtns = [
      {
        text: 'Mute',
        backgroundColor: 'blue',
        onPress: () => { this.muteItem(item.id) }
      },
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => { this.deleteItem(item.id) }
      }
    ]

    return (
      <View>
        <Swipeout right={swipeoutBtns}>
          <SingleNotification
            id={item.id}
            orgName={item.orgName}
            orgPhoto={item.orgPhoto}
            // onPress={this._onPressEventCard}
            message={item.message}
            timeAsStr={item.timeAsStr}
          />
          </Swipeout>
        <View style={styles.space}></View>
      </View>
    );
  };

  render() {
    return(
      <View>
      <FlatList
          style={styles.flatListStyle}
          renderItem={this._renderSingleNotification}
          data={this.state.notifications}
          //onRefresh={() => this._loadData()}
          keyExtractor={this._keyExtractor}
          // refreshing={isRefreshing}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatListStyle: {
    height: '100%',
  },
  space: {
    height: 6,
  }
});