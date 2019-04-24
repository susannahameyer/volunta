import React from 'react';
import { Icon, Font } from 'expo';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

export default class Faces extends React.Component {
  render() {
    // const {communityPhoto, communityName} = this.props
    const FACES = [
        {
          id: 0,
          imageUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/vista/128.jpg',
        },
        {
          id: 1,
          imageUrl: 'http://www.yojackets.com/wp-content/uploads/2016/04/Civil-War-Scarlet-Witch-Red-Coat-1.jpg',
        },
        {
          id: 2,
          imageUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg',
        },
        {
          id: 3,
          imageUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/k/128.jpg',
        },
        {
          id: 4,
          imageUrl: 'https://pbs.twimg.com/profile_images/885357926373654528/4tGgnF71_bigger.jpg',
        },
        {
          id: 5,
          imageUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/jina/128.jpg',
        },
        {
          id: 6,
          imageUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/chadengle/128.jpg',
        },
        {
          id: 7,
          imageUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg',
        },
      ];
       
      
    return (
      <View style={styles.container}>
        {/* <FacePile numFaces={4} faces={FACES} circleSize={30} offset={1} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fff',
      },
});