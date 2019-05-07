import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList, 
  console
} from 'react-native';
import SingleNotification from '../components/SingleNotification';
//import console = require('console');

export default class NotificationsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: [
        {orgName: 'puppies', orgPhoto: 'hello', message: 'hi', timeAsStr: '10h' }
      ],
      //isRefreshing: false,
      search: '',
      // interestedEventDocIds: new Set(), // IDs of all events that user is interested on
      // userId: c.TEST_USER_ID, // TODO: pass in as prop
      // interestedMap: new Map(), // <string, boolean>, tells us if user is interested in eventid
      // goingCounts: new DefaultDict(0), // <eventId, numGoing>
    };
  }

  _keyExtractor = (item, index) => item.orgName;

  _renderSingleNotification = ({ item }) => {
    return (
      <SingleNotification
        id={item.orgName}
        orgName={item.orgName}
        // onPress={this._onPressEventCard}
        message={item.message}
        timeAsStr={item.timeAsStr}
      />
    );
  };

  render() {
    return(
      <Button title="Add Pet" onPress={console.log('button')} />
      <FlatList
            style={styles.flatListStyle}
            renderItem={this._renderSingleNotification}
            data={this.notifications}
            //onRefresh={() => this._loadData()}
            keyExtractor={this._keyExtractor}
            // refreshing={isRefreshing}
        />
    // <View style={styles.container}>
    //   <SingleNotification orgName={'Puppy Love'} orgPhoto={'kanye'} message={'Don’t forget to bring walking shoes and water to the puppy marathon!'} timeAsStr={'12h'}/>
    // </View>
    );
  }
}

const styles = StyleSheet.create({
  flatListStyle: {
    height: '100%',
  }
});