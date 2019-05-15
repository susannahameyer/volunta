import React from 'react';
import { 
  createAppContainer, 
  createSwitchNavigator, 
  createStackNavigator 
} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LoginScreen';
import NUXCommunityScreen from '../screens/NUXCommunityScreen';
import InterestsScreen from '../screens/InterestsScreen';

export const AuthStack = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      title: "Sign Up"
    }
  },
  NUXCommunity: {
    screen: NUXCommunityScreen,
    navigationOptions: {
      title: "Community"
    }
  },
  Interests: {
    screen: InterestsScreen,
    navigationOptions: {
      title: "Interests"
    }
  },
  LogIn: {
    screen: LogInScreen,
    navigationOptions: {
      title: "Log In"
    }
  }
});

export default AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
