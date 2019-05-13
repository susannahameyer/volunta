import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import InterestBubble from './InterestBubble';

export default class EventPageInterestsScroll extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderInterestBubble = ({ item }) => {
    return <InterestBubble interestName={item} />;
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          marginRight: 10,
        }}
      />
    );
  };

  render() {
    const { interests } = this.props;

    return (
      <View style={{ height: 40 }}>
        <FlatList
          horizontal={true}
          data={interests}
          renderItem={this._renderInterestBubble}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={this._renderSeparator}
          //   contentContainerStyle={{ paddingRight: 30 }}
        />
      </View>
    );
  }
}
