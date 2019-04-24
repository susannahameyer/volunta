import React from 'react';
import { Icon } from 'expo';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../constants/Colors';
import EventCardConstants from '../constants/EventCardConstants';

export default class EventCard extends React.Component {
  render() {
    return (
        <View style={styles.shadow}>
          <TouchableOpacity style={styles.cardContainer}>
            <View style={styles.shadow}>
              <Image
                source={this.props.coverPhoto}
                style={styles.coverPhoto}
              />
              <Text style={styles.titleText}>
                {this.props.title}
              </Text>
            </View>
            
          </TouchableOpacity>
        </View>
        
    );
  }
}

const styles = StyleSheet.create({
    cardContainer: {
        height: EventCardConstants.cardHeight,
        width: EventCardConstants.cardWidth,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
        overflow: 'hidden',
        
    },
    coverPhoto: {
        height: '50%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    shadow: {
      flex: 1,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      backgroundColor : "#0000" // invisible color
    },
    titleText: {
      fontFamily: 'montserrat',
      fontSize: 20,
      fontWeight: '500',

    }
});