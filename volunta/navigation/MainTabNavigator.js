import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FeedScreen from '../screens/FeedScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EventScreen from '../screens/EventScreen';
import FacepileDetailScreen from '../screens/FacepileDetailScreen';

const FeedStack = createStackNavigator({
  Feed: FeedScreen,
  Event: EventScreen,
  Facepile: FacepileDetailScreen,
  Profile: ProfileScreen,
},{
  headerMode: 'screen',
});

FeedStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-list-box'} />
  ),
};

const CommunityStack = createStackNavigator({
  Community: CommunityScreen,
  Event: EventScreen,
  Facepile: FacepileDetailScreen,
  Profile: ProfileScreen,
});

CommunityStack.navigationOptions = {
  tabBarLabel: 'Community',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-people'} />
  ),
};

const NotificationsStack = createStackNavigator({
  Notifications: NotificationsScreen,
});

NotificationsStack.navigationOptions = {
  tabBarLabel: 'Notifications',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-notifications'} />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Event: EventScreen,
  Facepile: FacepileDetailScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

export default createBottomTabNavigator(
  {
    FeedStack,
    CommunityStack,
    NotificationsStack,
    ProfileStack,
  },
  {
    tabBarOptions: {
      showLabel: false,
    },
  }
);
