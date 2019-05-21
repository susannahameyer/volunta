import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LoginScreen';
import NUXCommunityScreen from '../screens/NUXCommunityScreen';
import NUXInterestsScreen from '../screens/NUXInterestsScreen';

export const AuthStack = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      title: 'Sign Up',
    },
  },
  LogIn: {
    screen: LogInScreen,
    navigationOptions: {
      title: 'Log In',
    },
  },
});

export const NUXStack = createStackNavigator({
  NUXCommunity: {
    screen: NUXCommunityScreen,
    navigationOptions: {
      title: 'Community',
    },
  },
  NUXInterests: {
    screen: NUXInterestsScreen,
    navigationOptions: {
      title: 'Interests',
    },
  },
});

export default (AppContainer = createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    NUX: NUXStack,
    Main: MainTabNavigator,
    Auth: AuthStack,
  })
));
