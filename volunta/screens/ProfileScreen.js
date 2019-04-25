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
      <View style={styles.container}>
      <View style={styles.profileBar}>
        <Image style={styles.profilePic} source={require('../assets/images/kanye.png')} />
        <View style={styles.upperText}>
          <Text style={styles.personName}>Kanye West</Text>
          <Text style={styles.communityName}>Stanford University</Text>
        </View>
      </View>
      <View style={styles.interestBar}>
        <Text style={styles.sectionTitle}>interests:</Text>
      </View>
      <View style={styles.comingUpBar}>
        <Text style={styles.sectionTitle}>coming up:</Text>
      </View>
      <View style={styles.helpedBar}>
        <Text style={styles.sectionTitle}>how I've helped:</Text>
      </View>
      <View>
        <Text style={styles.sectionTitle}>volunteer network:</Text>
      </View>
      </View> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft:20,
  },
  profileBar: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize:22,
    fontFamily: 'montserrat'
  },
  profilePic: {
    width: 90,
    height: 90, 
    borderRadius: 45,
    marginRight:20,
    marginVertical:12
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
  },
  interestBar: {
    height:100
  },
  comingUpBar: {
    height:200
  },
  helpedBar: {
    height:150
  },
});