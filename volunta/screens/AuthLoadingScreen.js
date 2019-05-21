import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import * as firebase from 'firebase';

// This component is meant to check if a user is logged in. If they are,
// it navigates to the MainTabNavigator, otherwise to the AuthStack.
export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(!!user ? 'Main' : 'Auth');
    });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
