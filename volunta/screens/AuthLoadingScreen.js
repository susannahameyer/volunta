import React from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import * as firebase from 'firebase';
import { getUserProperty } from '../firebase/api';

// This component is meant to check if a user is logged in. If they are,
// it navigates to the MainTabNavigator, otherwise to the AuthStack.
export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (!!user) {
        const userCompletedNUX = await getUserProperty(
          user.uid,
          'registration_completed'
        );
        if (userCompletedNUX) {
          this.props.navigation.navigate('Main');
        } else {
          this.props.navigation.navigate('NUX');
        }
      } else {
        this.props.navigation.navigate('Auth');
      }
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
