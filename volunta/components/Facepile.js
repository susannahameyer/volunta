import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

/*
This component recieves a list of user IDs passed in through props
and creates a facestack to display the photos of these users. When
the stack is clicked, a modal will appear displaying more details
about the specific users. 

Props:
    - imageDiameter
    - maxNumImages
    - totalWidth
    - pileTitle: What will be displayed when the user click in, default: 'details'
    - navigation: required to make sure that the pile can go to another screen
    - members: list  of User IDs
*/
export default class Facepile extends React.Component {
  _getUsersFromIDs = () => {
    return [
      {
        name: 'Luis Varela',
        photo: require('../assets/images/person1.jpeg'),
        key: '1',
      },
      {
        name: 'Katherine Eisenbrand',
        photo: require('../assets/images/person2.jpeg'),
        key: '2',
      },
      {
        name: 'Susannah Meyer',
        photo: require('../assets/images/person3.jpeg'),
        key: '3',
      },
      {
        name: 'Cody Hankins',
        photo: require('../assets/images/person4.jpg'),
        key: '4',
      },
      {
        name: 'Ian Hodge',
        photo: require('../assets/images/person5.jpeg'),
        key: '5',
      },
      {
        name: 'Kanye West',
        photo: require('../assets/images/kanye.png'),
        key: '6',
      },
      {
        name: 'John Smith',
        photo: require('../assets/images/person5.jpeg'),
        key: '7',
      },
      {
        name: 'Another Person',
        photo: require('../assets/images/person7.jpeg'),
        key: '8',
      },
      {
        name: 'More Person',
        photo: require('../assets/images/person8.jpg'),
        key: '9',
      },
      {
        name: 'Wendy Peffercorn',
        photo: require('../assets/images/person2.jpeg'),
        key: '10',
      },
      {
        name: 'Anna Jones',
        photo: require('../assets/images/person3.jpeg'),
        key: '11',
      },
      {
        name: 'Yeet Yeet',
        photo: require('../assets/images/person5.jpeg'),
        key: '12',
      },
      {
        name: 'Yeet Yeet Yeet',
        photo: require('../assets/images/person5.jpeg'),
        key: '13',
      },
      {
        name: 'Horse FaceGirl',
        photo: require('../assets/images/person9.jpg'),
        key: '14',
      },
      {
        name: 'Horse FaceGirl',
        photo: require('../assets/images/person9.jpg'),
        key: '15',
      },
      {
        name: 'Magic Mike',
        photo: require('../assets/images/person10.jpg'),
        key: '16',
      },
    ];
  };

  _renderFacepilePhoto = (item, index) => {
    //Calculates the overlap between the images based on width and image size
    const overlapMargin =
      (this.props.totalWidth -
        this.props.imageDiameter * this.props.maxNumImages) /
      (this.props.maxNumImages - 1);
    const imageStyle = {
      borderRadius: this.props.imageDiameter / 2,
      width: this.props.imageDiameter,
      height: this.props.imageDiameter,
      marginRight: overlapMargin,
    };

    //Declares the overlay for the last image in the pile only
    let overlay = <View />;
    if (index + 1 == this.props.maxNumImages) {
      overlay = (
        <View
          style={[
            imageStyle,
            {
              position: 'absolute',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <View style={[imageStyle, styles.lastImageOverlay]} />
          <Icon
            name={'ellipsis1'}
            size={this.props.imageDiameter / 1.5}
            color={'white'}
          />
        </View>
      );
    }

    //Renders the image
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.push('Facepile', {
              users: this.props.members,
              title: this.props.pileTitle,
            });
          }}
        >
          <Image
            source={{ uri: item.profile_pic_url }}
            style={[styles.profileImage, imageStyle]}
          />
        </TouchableOpacity>
        {overlay}
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.members.slice(0, this.props.maxNumImages)}
        horizontal={true}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
        }}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item, index }) => this._renderFacepilePhoto(item, index)}
      />
    );
  }
}

const styles = StyleSheet.create({
  pileContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
  },
  lastImageOverlay: {
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.3,
  },
});
