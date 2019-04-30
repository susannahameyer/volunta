import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SignUpScreen from "./screens/SignUpScreen";
import LogInScreen from "./screens/LogInScreen";

export const AuthStack = createStackNavigator({
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      title: "Sign Up"
    }
  },
  SignIn: {
    screen: LogInScreen,
    navigationOptions: {
      title: "Log In"
    }
  }
});

export default createAppContainer(createSwitchNavigator(
  {
    Main: MainTabNavigator,
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));