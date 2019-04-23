import React from 'react';
import { Icon, Font, LinearGradient } from 'expo';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

export default class CommunityCoverPhoto extends React.Component {
  render() {
    return (
      <View>
        {/* Community cover photo */}
        <Image
            source={require('../assets/images/Stanford.png')}
            style={styles.photo}
        />
        <View style={styles.rectangle} />
        {/* Community name
            - should limit input community name char count to fit one line
         */}
        <View style={styles.container}>
          <Text style={styles.titleText}>
            {'Stanford Community'}
          </Text>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    width: Dimensions.get('window').width,
    height: 195,
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangle: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    bottom: 60,
  },
    titleText: {
    height: 36,
    bottom: 84,
    fontSize: 24,
    color: 'white',
    fontFamily: 'montserrat'
  },
});