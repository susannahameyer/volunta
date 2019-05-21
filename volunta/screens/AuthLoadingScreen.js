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
    // For when user signs out.
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.navigation.navigate('Auth');
      }
    });

    // For when app is opened.
    let user = await firebase.auth().currentUser;
    this.props.navigation.navigate(!!user ? 'Main' : 'Auth');
    console.log(user);
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
