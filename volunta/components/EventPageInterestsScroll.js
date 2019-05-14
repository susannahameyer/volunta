import React from 'react';
import { View, FlatList } from 'react-native';
import InterestBubble from './InterestBubble';

/*
This component displays the interests associated with a
particular event in the event page's about section

Props:
    - interests
*/

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
          marginRight: 7,
        }}
      />
    );
  };

  render() {
    const { interests } = this.props;

    return (
      <View>
        <FlatList
          horizontal={true}
          data={interests}
          renderItem={this._renderInterestBubble}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={this._renderSeparator}
        />
      </View>
    );
  }
}
