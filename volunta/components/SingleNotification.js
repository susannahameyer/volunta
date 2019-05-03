import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default class SingleNotification extends React.Component {
  render() {
    const {interestName} = this.props
    return (
      <View style={styles.box}>
        <Image style={styles.organizationPic} source={require('../assets/images/kanye.png')} />
        <Text style={styles.organizationText}>Puppy Love</Text>
        <Text style={styles.messageText}>{interestName}</Text>
        <Text style={styles.timeText}>12h</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    box: {
        backgroundColor:'#EEEEEE',
        height: 90,
        marginVertical: 7,
    },
    organizationPic: {
        position: 'absolute',
        height: 60,
        width: 60,
        marginLeft: 15, 
        marginTop: 12,
        borderRadius: 30
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
        fontFamily: 'montserrat',
        fontSize: 12
    },
    timeText: {
        color: 'black',
        fontFamily: 'montserrat',
        fontSize: 14,
        position: 'absolute',
        marginTop: 35,
        marginLeft: 325
    }
});