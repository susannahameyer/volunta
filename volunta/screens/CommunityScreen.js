import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Facepile from '../components/Facepile';
import CommunityCoverPhoto from '../components/CommunityCoverPhoto';
import CommunityProfileEventCardHorizontalScroll from '../components/CommunityProfileEventCardHorizontalScroll';

export default class CommunityScreen extends React.Component {
  static navigationOptions = {
    title: 'Community',
  };

  render() {
    // upcomingEvents and pastEvents are just hard-coded for now
    // cover_url, title, date will come directly from events table
    // org_name also from events table through reference
    // comingUp: calculate based on date
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
      <View>
        <CommunityCoverPhoto communityPhoto={'https://i.imgur.com/Es0yqyh.png'} communityName={'Stanford Community'}/>
          <View style={styles.topText}>
            <Text style={styles.titleText}>
              {'in my community'}
            </Text>
          </View>
          <View style={styles.facepileContainer}>
            <Facepile
              totalWidth={335}
              maxNumImages={10}
              imageDiameter={50}
              />
          </View>
          
          <View style={styles.middleText}>
            <Text style={styles.titleText}>
              {'coming up'}
            </Text>
          </View>
          <View style={styles.upcomingScroll}>
            <CommunityProfileEventCardHorizontalScroll events={upcomingEvents} />
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.titleText}>
              {'how we\'ve helped'}
            </Text>
            <View style={styles.pastScroll}>
              <CommunityProfileEventCardHorizontalScroll events={pastEvents} />
            </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'montserrat',
    fontSize: 19,
    color: 'black',
    left: 19,
  },
  topText: {
    top: -44,
  },
  facepileContainer: {
    left: 19,
    top: -42,
  },
  middleText: {
    top: -30,
  },
  bottomText: {
    top: -20,
  },
  placeholder: {
    width: 335,
    height: 50,
    backgroundColor: 'grey',
    left: 19,
    top: -42,
  },
  upcomingScroll: {
    left: 15,
    top: -25,
  },
  pastScroll: {
    left: 15,
    top: 7,
  }
});
