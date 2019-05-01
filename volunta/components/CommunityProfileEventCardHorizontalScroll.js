import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import CommunityProfileEventCard from '../components/CommunityProfileEventCard';

export default class CommunityProfileEventCardHorizontalScroll extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderEventCard = ({ item }) => {
    return (
      <CommunityProfileEventCard
        event={item}
      />
    );
  };

  _renderSeparator = () => {
    let upcoming = this.props.events[0].comingUp;
    return (
      <View
        style={{
          marginRight: 10,
          height: upcoming ? 164 : 127,
        }}
      />
    );
  };

  render() {
    const { events } = this.props;

    return (
      <View style={{ height: 164 }}>
        <FlatList
          horizontal={true}
          data={events}
          renderItem={this._renderEventCard}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={this._renderSeparator}
          contentContainerStyle={{ paddingRight: 30 }}
        />
      </View>
    );
  }
}
