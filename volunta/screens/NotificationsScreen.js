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
} from 'react-native';
import SingleNotification from '../components/SingleNotification';

export default class NotificationsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: [
        {orgName: 'Girls Who Code', orgPhoto: 'https://i.imgur.com/VuKnN5P.jpg', message: 'Remember to come 10 minutes early to set up one of the workstations!', timeAsStr: '2h' },
        {orgName: 'Lion\'s Club', orgPhoto: 'https://i.imgur.com/PZB82WT.jpg', message: 'The cookie baking contest has been postponed until Saturday.', timeAsStr: '10h' },
        {orgName: 'Beach Cleanup', orgPhoto: 'https://i.imgur.com/C6PL9tB.jpg', message: 'The weather is going to be perfect! Bring sunscreen and a hat.', timeAsStr: '5d' },
        {orgName: 'Community Culture', orgPhoto: 'https://i.imgur.com/9ncYySC.jpg', message: 'Please sign up for a dish at the potluck after registering!', timeAsStr: '2w' },
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
        orgPhoto={item.orgPhoto}
        // onPress={this._onPressEventCard}
        message={item.message}
        timeAsStr={item.timeAsStr}
      />
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