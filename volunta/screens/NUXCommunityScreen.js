import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class NUXCommunityScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressContinue = event => {
    this.props.navigation.navigate('Interests');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to volunta!</Text>
        <Text style={styles.detailText}>
          Please choose the community you want to register your account with.
        </Text>
        <View>
          {' '}
          style={styles.buttonContainer}
          <TouchableOpacity onPress={this._onPressContinue}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>continue</Text>
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
    color: '#FFFFFF',
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: 'normal',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 25,
  },
  welcomeText: {
    fontFamily: 'montserrat',
    fontSize: 24,
    marginTop: 80,
  },
  detailText: {
    textAlign: 'center',
    fontFamily: 'montserrat',
    fontSize: 24,
    marginTop: 35,
  },
  buttonContainer: {},
});
