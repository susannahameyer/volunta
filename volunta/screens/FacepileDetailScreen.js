import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { SearchBar } from 'react-native-elements';

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

    render() {

        return (
            <View>
                <SearchBar
                    placeholder=""
                    lightTheme
                    round
                    containerStyle={styles.searchContainerStyle}
                    inputContainerStyle={styles.searchInputContainerStyle}/>
                <Text>
                    You made it here!
                </Text>
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
  });