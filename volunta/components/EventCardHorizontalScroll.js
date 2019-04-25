import React from 'react';
import { Icon, Font, LinearGradient } from 'expo';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
} from 'react-native';
import CommunityEventCard from '../components/CommunityEventCard';

export default class EventCardHorizontalScroll extends React.Component {
    constructor(props) {
        super(props);
        // Static right now, need to connect with api.js 
        this.state = {
          events: props.events,
        };
    }

    _renderEventCard = ({ item }) => <CommunityEventCard {...item} />;

    _renderSeparator = () => {
        var upcoming = this.props.events[0].comingUp;
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
        const { events } = this.props
        return (
        <View>
            <FlatList 
                horizontal={true} 
                data={events}
                renderItem={this._renderEventCard}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={this._renderSeparator}
              />
        </View>
        );
    }
}