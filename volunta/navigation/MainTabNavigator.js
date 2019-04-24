import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FeedScreen from '../screens/FeedScreen';
import CommunityScreen from '../screens/CommunityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const FeedStack = createStackNavigator({
  Feed: FeedScreen
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

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
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

export default createBottomTabNavigator({
  FeedStack,
  CommunityStack,
  SettingsStack,
  NotificationsStack
});
