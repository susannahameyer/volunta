import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AssetFilePaths from '../constants/AssetFilePaths';

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressLogIn = event => {
    this.props.navigation.navigate('LogIn');
  };

  // Function we pass to Sign Up button, pushes sign up screen onto stack
  _onPressSignUp = event => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={AssetFilePaths.logo} style={styles.logo} />
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity onPress={this._onPressLogIn}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>log in</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressSignUp}>
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
    fontFamily: 'raleway',
    fontSize: 18,
    fontWeight: 'normal',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 234,
    height: 223,
    resizeMode: 'contain',
    marginTop: 120,
  },
});
