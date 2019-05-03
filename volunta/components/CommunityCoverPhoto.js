import React from 'react';
import { Icon, Font, LinearGradient } from 'expo';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';

export default class CommunityCoverPhoto extends React.Component {
  render() {
    const { communityPhoto, communityName } = this.props;
    return (
      <View>
        {/* Community cover photo */}
        <Image source={{ uri: communityPhoto }} style={styles.photo} />

        {/* Gradient banner for text */}
        <View style={styles.banner}>
          <LinearGradient
            colors={['rgba(90,90,90,0.25)', 'rgba(40,40,40,.95)']}
            style={{ flex: 1 }}
          />
        </View>

        {/* Community name
            - should limit input community name char count to fit one line
         */}
        <View style={styles.container}>
          <Text style={styles.titleText}>{communityName}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    width: Dimensions.get('window').width,
    height: 175,
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: Dimensions.get('window').width,
    height: 60,
    bottom: 60,
  },
  titleText: {
    height: 36,
    bottom: 84,
    fontSize: 24,
    color: 'white',
    fontFamily: 'montserrat',
  },
  screenText: {
    fontFamily: 'montserrat',
    fontSize: 20,
  },
});
