import React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class HomeScreen extends React.Component {

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressLogIn = event => {  };

  // Function we pass to Sign Up button, pushes sign up screen onto stack
  _onPressSignUp = event => {  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Button 
            color="#0081AF"
            onPress={this._onPressLogIn}
            title="Log In"
          />
          <Button 
            color="#0081AF"
            onPress={this._onPressSignUp}
            title="Sign Up"
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
