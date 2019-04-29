import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const assetFilePath = '../assets/images/';

export default class HomeScreen extends React.Component {

  // Function we pass to Log In button, pushes login screen onto stack
  // TODO: push login screen
  _onPressLogIn = event => { };

  // Function we pass to Sign Up button, pushes sign up screen onto stack
  // TODO: push signup screen
  _onPressSignUp = event => { };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require(assetFilePath + 'logo.png')}
          style={styles.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressLogIn}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>log in</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressLogIn}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0081AF',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginTop: 20,
    width: 202,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: 'normal',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: 234,
    height: 223,
    resizeMode: 'contain',
  },
});
