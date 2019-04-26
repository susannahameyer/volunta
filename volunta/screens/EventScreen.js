import React from 'react';
import { View, Text } from 'react-native';

export default class EventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.navigation.getParam('event')
    };
  }

  render() {
    const event = this.state.event;
    return (
      <View>
        <Text>Event: {event.title}</Text>
      </View>
    );
  }
}
