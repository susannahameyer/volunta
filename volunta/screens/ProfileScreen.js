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
import { Ionicons } from '@expo/vector-icons';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    return (
      <View style={styles.profileBar}>
        <Image style={styles.profilePic} source={require('../assets/images/kanye.png')} />
        <View style={styles.upperText}>
          <Text style={styles.personName}>Kanye West</Text>
          <Text style={styles.communityName}>Stanford University</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileBar: {
    flexDirection: 'row',
  },
  profilePic: {
    width: 90,
    height: 90, 
    borderRadius: 45,
    margin:20
  },
  upperText: {
    justifyContent: 'center',
  },
  personName: {
    fontSize:28,
    fontFamily: 'montserrat'
  },
  communityName: {
    fontSize:16,
    color:'#838383',
    fontFamily: 'montserrat'
  }
});