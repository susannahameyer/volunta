import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FeedScreen from '../screens/FeedScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EventScreen from '../screens/EventScreen';

const FeedStack = createStackNavigator({
  Feed: FeedScreen,
  Event: EventScreen,
});

FeedStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-menu'} />
  )
};

const CommunityStack = createStackNavigator({
  Community: CommunityScreen
});

CommunityStack.navigationOptions = {
  tabBarLabel: 'Community',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-people'} />
  )
};

const NotificationsStack = createStackNavigator({
  Notifications: NotificationsScreen
});

NotificationsStack.navigationOptions = {
  tabBarLabel: 'Notifications',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-notifications'} />
  )
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  )
};

export default createBottomTabNavigator({
  FeedStack,
  CommunityStack,
  NotificationsStack,
  ProfileStack
}, {tabBarOptions: {
  showLabel: false,
},});
