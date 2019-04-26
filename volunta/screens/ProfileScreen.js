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
import InterestBubble from '../components/InterestBubble';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    const upcomingEvents = [
      {
        cover_url:'https://i.imgur.com/c6JH6uo.jpg',
        title:'Volunteer Opportunity',
        org_name:'Girls Who Code',
        date:'6/12/19',
        comingUp:true,
      },
      {
        cover_url:'https://i.imgur.com/c6JH6uo.jpg',
        title:'Volunteer Opportunity',
        org_name:'Girls Who Code',
        date:'6/12/19',
        comingUp:true,
      },
      {
        cover_url:'https://i.imgur.com/c6JH6uo.jpg',
        title:'Volunteer Opportunity',
        org_name:'Girls Who Code',
        date:'6/12/19',
        comingUp:true,
      },
    ];

    const pastEvents = [
      {
        cover_url:'https://i.imgur.com/c6JH6uo.jpg',
        title:'Volunteer Opportunity',
        org_name:'Girls Who Code',
        date:'6/12/19',
        comingUp:false,
      },
      {
        cover_url:'https://i.imgur.com/c6JH6uo.jpg',
        title:'Volunteer Opportunity',
        org_name:'Girls Who Code',
        date:'6/12/19',
        comingUp:false,
      },
      {
        cover_url:'https://i.imgur.com/c6JH6uo.jpg',
        title:'Volunteer Opportunity',
        org_name:'Girls Who Code',
        date:'6/12/19',
        comingUp:false,
      },
    ];


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
        <View style={styles.singleInterestRow}>
          <InterestBubble interestName={'puppies'}/>
          <InterestBubble interestName={'environmental'}/>
          <InterestBubble interestName={'civics'}/>
        </View>
        <View style={styles.singleInterestRow}>
          <InterestBubble interestName={'public health'}/>
          <InterestBubble interestName={'kitties'}/>
          <InterestBubble interestName={'social good'}/>
        </View>
      </View>
      <View style={styles.comingUpBar}>
        <Text style={styles.sectionTitle}>coming up:</Text>
        <View style={styles.upcomingScroll}>
            <CommunityProfileEventCardHorizontalScroll events={upcomingEvents} />
        </View>
      </View>
      <View style={styles.helpedBar}>
        <Text style={styles.sectionTitle}>how I've helped:</Text>
        <CommunityProfileEventCardHorizontalScroll events={pastEvents} />
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
    marginHorizontal:20,
  },
  profileBar: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize:20,
    fontFamily: 'montserrat',
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
    height:110
  },
  singleInterestRow: {
    justifyContent: 'space-evenly',
    flexDirection:'row',
    marginVertical: 5
  },
  comingUpBar: {
    height:200
  },
  upcomingScroll: {
    marginTop:8
  },
  helpedBar: {
    height:150
  },
});