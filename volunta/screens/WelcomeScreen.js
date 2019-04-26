import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class HomeScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 183,
  },
  logo: {
    width: 234,
    height: 223,
    resizeMode: 'contain',
  },
});
