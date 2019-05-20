import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllCommunityNames } from '../firebase/api';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class NUXCommunityScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCommunity: '',
      communities: [],
      continueDisabled: true,
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const communityNames = await getAllCommunityNames();
    const communities = communityNames.map(name => {
      return {
        id: name,
        name: name,
      };
    });
    this.setState({
      communities,
    });
  };

  // TODO: Add chosen community to current user's community in db
  _onPressContinue = community => {
    this.props.navigation.navigate('NUXInterests');
  };

  _onSelect = selected => {
    this.setState({
      selectedCommunity: selected.name,
      continueDisabled: false,
    });
  };

  render() {
    const { selectedCommunity, communities, continueDisabled } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to volunta!</Text>
        <Text style={styles.detailText}>
          {'Communities, the schools or organizations that our users belong to, are at the core of volunta.\n\n' +
            'Register with a community to join a larger network of volunteers, ' +
            'browse service events sponsored by your community, and connect with fellow community members.'}
        </Text>
        <SearchableDropdown
          onItemSelect={item => this._onSelect(item)}
          containerStyle={styles.dropdown}
          textInputStyle={styles.textInput}
          itemStyle={styles.dropdownItem}
          itemTextStyle={{ fontFamily: 'montserrat', fontSize: 14 }}
          itemsContainerStyle={{ maxHeight: 185 }}
          items={communities}
          placeholder={'search for a community...'}
          placeholderTextColor={'grey'}
          resetValue={false}
        />
        <View style={styles.continueButtonContainer}>
          <TouchableOpacity
            onPress={this._onPressContinue}
            disabled={continueDisabled}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: continueDisabled ? 'grey' : '#0081AF',
                },
              ]}
            >
              <Text style={styles.buttonText}>continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0081AF',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginTop: 20,
    width: 202,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: 'normal',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 27,
  },
  welcomeText: {
    fontFamily: 'montserrat-medium',
    fontSize: 22,
    marginTop: 40,
  },
  detailText: {
    textAlign: 'center',
    fontFamily: 'montserrat',
    fontSize: 18,
    marginTop: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButtonContainer: {
    marginTop: 10,
  },
  dropdown: {
    marginTop: 25,
    width: 250,
    height: 230,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#ddd',
    borderColor: '#bbb',
    borderWidth: 0.2,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'montserrat',
    fontSize: 14,
  },
});
