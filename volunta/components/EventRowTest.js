import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

export default class EventRow extends React.Component {
  render() {
    return (
      <View style={styles.row}>
        <Text>Event Title: {this.props.title}</Text>
      </View>
    );
  }
}

EventRow.propTypes = {
  title: PropTypes.string
};

const styles = StyleSheet.create({
  row: { padding: 20 }
});
