import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllCommunities, setUserCommunity } from '../firebase/api';
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as firebase from 'firebase';

export default class NUXCommunityScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCommunity: '',
      communities: [],
      communityMap: new Map(),
      continueDisabled: true,
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const communityMap = await getAllCommunities();
    const communityNames = Array.from(communityMap.keys());
    const communities = communityNames.map(name => {
      return {
        id: name,
        name: name,
      };
    });
    this.setState({
      communities,
      communityMap,
    });
  };

  // TODO: Add chosen community to current user's community in db
  _onPressContinue = async communityName => {
    this.props.navigation.navigate('NUXInterests');
    let userId = await firebase.auth().currentUser.uid;
    await setUserCommunity(userId, this.state.communityMap.get(communityName));
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
          itemTextStyle={{ fontFamily: 'raleway', fontSize: 14 }}
          itemsContainerStyle={{ maxHeight: 185 }}
          items={communities}
          placeholder={'search for a community...'}
          placeholderTextColor={'grey'}
          resetValue={false}
        />
        <View style={styles.continueButtonContainer}>
          <TouchableOpacity
            onPress={async () => await this._onPressContinue(selectedCommunity)}
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
    fontFamily: 'raleway',
    fontSize: 18,
    fontWeight: 'normal',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 27,
  },
  welcomeText: {
    fontFamily: 'raleway-medium',
    fontSize: 22,
    marginTop: 40,
  },
  detailText: {
    textAlign: 'center',
    fontFamily: 'raleway',
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
    backgroundColor: '#F2F2F2',
    borderColor: '#bbb',
    borderWidth: 0.2,
  },
  textInput: {
    padding: 12,
    borderWidth: 0.4,
    borderColor: '#bbb',
    fontFamily: 'raleway',
    fontSize: 14,
  },
});
