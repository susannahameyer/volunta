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

    render() {
        const { events } = this.props
        return (
        <View>
            <FlatList 
                horizontal={true} 
                data={events}
                renderItem={this._renderEventCard}
                keyExtractor={(_, index) => index.toString()}
              />
        </View>
        );
    }
}

const styles = StyleSheet.create({

});