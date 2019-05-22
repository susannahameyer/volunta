import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {
  getAllInterestNames,
  getAllInterests,
  setUserInterests,
} from '../firebase/api';
import InterestSquare from '../components/InterestSquare';
import * as firebase from 'firebase';

export default class NUXInterestsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interests: [],
      // Maps from interest name to boolean of user selection
      interestsMap: new Map(),
      loaded: false,
      // Maps from interest name to reference object
      interestRefsMap: new Map(),
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const interests = await getAllInterestNames();
    const interestRefsMap = await getAllInterests();
    var interestsMap = new Map();
    // Map all interests to false (i.e. not selected) at first
    interests.forEach(interest => {
      interestsMap.set(interest, false);
    });

    this.setState({
      interests,
      interestsMap,
      loaded: true,
      interestRefsMap,
    });
  };

  _updateInterestsMap = (interestName, selected) => {
    var interestsMap = this.state.interestsMap;
    interestsMap = interestsMap.set(interestName, selected);
    this.setState({
      interestsMap,
    });
  };

  _renderInterestSquare = ({ item }) => {
    return (
      <InterestSquare
        interestName={item}
        // Bind 'this' to update the state of the parent from the child
        updateParentInterestsMap={this._updateInterestsMap.bind(this)}
      />
    );
  };

  // TODO: Save interests set to true in interestsMap to current user's interests in db
  _onPressDone = async interestRefs => {
    this.props.navigation.navigate('Feed');
    let userId = await firebase.auth().currentUser.uid;
    let selectedInterestRefs = [];
    for (const k of this.state.interestsMap.keys()) {
      if (this.state.interestsMap.get(k) == true) {
        let interestRef = this.state.interestRefsMap.get(k);
        selectedInterestRefs.push(interestRef);
      }
    }
    await setUserInterests(userId, selectedInterestRefs);
    // setUserCommunity(userId, this.state.communityMap.get(communityName));
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          marginVertical: 10,
        }}
      />
    );
  };

  render() {
    const { interests, interestsMap, loaded } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>what are your interests?</Text>
        <View style={styles.textContainer}>
          <Text style={styles.detailText}>
            These interests will be displayed on your profile to let other
            volunteers get to know you, and they can help you filter searches
            for service events.
          </Text>
        </View>

        <View style={styles.interestsGrid}>
          <FlatList
            data={interests}
            renderItem={this._renderInterestSquare}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            ItemSeparatorComponent={this._renderSeparator}
          />
        </View>
        <TouchableOpacity onPress={this._onPressDone} disabled={!loaded}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>done</Text>
          </View>
        </TouchableOpacity>
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
    width: 202,
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: 'normal',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  textContainer: {
    marginHorizontal: 40,
  },
  headerText: {
    fontFamily: 'montserrat-medium',
    fontSize: 22,
    marginTop: 40,
  },
  detailText: {
    textAlign: 'center',
    fontFamily: 'montserrat',
    fontSize: 15,
    marginTop: 30,
  },
  interestsGrid: {
    marginTop: 30,
    height: 350,
  },
});
