import React from 'react';
import { Icon } from 'expo';
import { Font } from 'expo';

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
          <Image
              source={require('../assets/images/Stanford.png')}
              style={styles.photo}
          />
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
  titleText: {
    height: 36,
    top: -20,
    fontSize: 24,
    color: 'white',
    fontFamily: 'montserrat'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});