import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EventPageHeader from '../components/EventPageHeader';

export default class EventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.navigation.getParam('event'),
    };
  }

  render() {
    const event = this.state.event;
    return (
      <View styles={styles.container}>
        <EventPageHeader
          eventTitle={'Mentor Training'}
          organizationName={'Girls Teaching Girls to Code'}
          organizationLogo={
            'data:image/png;base64,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'
          }
          coverPhoto={
            'https://cdn.aarp.net/content/dam/aarp/work/on-the-job/2015-08/740-Volunteer-your-way-to-next-job.imgcache.rev3e04f10287417ea880532326d1613331.jpg/jcr:content/renditions/cq5dam.web.420.270.jpeg'
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
});
