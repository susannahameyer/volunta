import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import CommunityProfileEventCard from '../components/CommunityProfileEventCard';

export default class CommunityProfileEventCardHorizontalScroll extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderEventCard = ({ item }) => {
    return (
      <CommunityProfileEventCard
        event={item}
        interested={this.props.interestedIDs.has(item.doc_id)}
        going={this.props.goingIDs.has(item.doc_id)}
        onPress={this.props.onPress}
        status={this.props.status}
        source={this.props.source}
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
    const { events, status, source } = this.props;
    if (events.length == 0) {
      return (
        <CommunityProfileEventCard
          event={null}
          status={status}
          source={source}
        />
      );
    }

    return (
      <View style={{ height: 164 }}>
        <FlatList
          horizontal={true}
          style={{ overflow: 'visible' }}
          showsHorizontalScrollIndicator={false}
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
