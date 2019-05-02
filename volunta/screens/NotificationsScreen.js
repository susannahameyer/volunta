import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SingleNotification from '../components/SingleNotification';

export default class NotificationsScreen extends React.Component {
  render() {
    return(
    <View style={styles.container}>
      <SingleNotification interestName={'Don’t forget to bring walking shoes and water to the puppy marathon!'}/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
  }
});