import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class SingleNotification extends React.Component {
  render() {
    const { orgName, orgPhoto, message, timeAsStr } = this.props;
    return (
      <View style={styles.box}>
        <Image style={styles.organizationPic} source={{ uri: orgPhoto }} />
        <Text style={styles.organizationText}>{orgName}</Text>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.timeText}>{timeAsStr}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    box: {
        backgroundColor:'#EEEEEE',
        height: 90,
    },
    organizationPic: {
        height: 60,
        width: 60,
        marginLeft: 15, 
        marginTop: 12,
        borderRadius: 30,
        position: 'absolute',
    },
    organizationText: {
        marginTop: 18,
        marginLeft: 85,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    messageText: {
        marginLeft: 85,
        width: 225,
        color: 'black',
        fontFamily: 'raleway',
        fontSize: 12
    },
    timeText: {
        color: 'black',
        fontFamily: 'raleway',
        fontSize: 14,
        position: 'absolute',
        marginTop: 35,
        marginLeft: 325
    }
});