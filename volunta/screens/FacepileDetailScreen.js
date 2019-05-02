import React from 'react';
import { 
        View, 
        Text, 
        StyleSheet, 
        TouchableOpacity,
        Image 
    } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { SearchBar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

export default class FacepileDetailScreen extends React.Component {

    //Set title of screen
    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('title', 'Details'),
    })

    constructor(props) {
        super(props);
        this.state = {
            users: this.props.navigation.getParam('users')
        };
    }

    _renderUser = user => {
        return (
            <TouchableOpacity
                style={styles.userDetailsContainer}>
                <Image
                    style={styles.profileImage}
                    source={user.photo}/>
                <Text style={styles.profileText}>
                    {user.name}
                </Text>
                <Icon
                    name={'right'}
                    size={30}/>
            </TouchableOpacity>
        )
        
    }

    render() {

        return (
            <View>
                <SearchBar
                    placeholder=""
                    lightTheme
                    round
                    containerStyle={styles.searchContainerStyle}
                    inputContainerStyle={styles.searchInputContainerStyle}/>
                <FlatList
                    data={this.state.users}
                    renderItem={({item}) => this._renderUser(item)}
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
      marginHorizontal: 8
    },
    searchInputContainerStyle: {
      backgroundColor: '#E8E8E8'
    },
    userDetailsContainer: {
        height: 78,
        borderBottomColor: '#DCDCDC',
        borderBottomWidth: 1,
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginLeft:15,
        marginRight:12,
    },
    profileText: {
        fontFamily: 'montserrat',
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
    }
  });