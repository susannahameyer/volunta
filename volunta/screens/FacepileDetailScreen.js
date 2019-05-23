import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { SearchBar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

export default class FacepileDetailScreen extends React.Component {
  //Set title of screen
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title', 'Details'),
  });

  constructor(props) {
    super(props);
    this.state = {
      users: this.props.navigation.getParam('users'),
      displayedUsers: this.props.navigation.getParam('users'),
      searchText: '',
    };
  }

  //Search callback for the searchbar
  _filterFacePile = input => {
    this.setState({
      displayedUsers: this.state.users.filter(user =>
        user.name.includes(input)
      ),
      searchText: input,
    });
  };

  //Renders a single user that can be clicked to enter their profile
  _renderUser = user => {
    return (
      <TouchableOpacity
        style={styles.userDetailsContainer}
        onPress={() =>
          this.props.navigation.push('Profile', { userId: user.id })
        }
      >
        <Image
          style={styles.profileImage}
          source={{ uri: user.profile_pic_url }}
        />
        <Text style={styles.profileText}>{user.name}</Text>
        <Icon
          name={'right'}
          size={20}
          color={'grey'}
          style={{
            marginLeft: 'auto',
            marginRight: 5,
          }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          placeholder={
            'Search ' + this.props.navigation.getParam('title', 'Details')
          }
          onChangeText={text => this._filterFacePile(text)}
          value={this.state.searchText}
          lightTheme
          round
          containerStyle={styles.searchContainerStyle}
          inputContainerStyle={styles.searchInputContainerStyle}
        />
        <FlatList
          data={this.state.displayedUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => this._renderUser(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainerStyle: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginHorizontal: 8,
  },
  searchInputContainerStyle: {
    backgroundColor: '#E8E8E8',
  },
  userDetailsContainer: {
    height: 78,
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 12,
  },
  profileText: {
    fontFamily: 'raleway',
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
});
