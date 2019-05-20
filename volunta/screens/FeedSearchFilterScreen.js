import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AssetFilePaths from '../constants/AssetFilePaths';

export default class WelcomeScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressLogIn = event => {
    this.props.navigation.navigate('LogIn')
  };

  // Function we pass to Sign Up button, pushes sign up screen onto stack

  render() {
    return (
      <View style={styles.container}>
        <Text> Hello </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
