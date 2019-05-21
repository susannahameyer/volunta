import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { getAllInterestNames } from '../firebase/api';
import InterestSquare from '../components/InterestSquare';

export default class NUXInterestsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interests: [],
      interestsMap: new Map(),
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const interests = await getAllInterestNames();
    var interestsMap = new Map();
    // Map all interests to false (not selected) at first
    interests.forEach(interest => {
      interestsMap.set(interest, false);
    });

    this.setState({
      interests,
      interestsMap,
    });
  };

  _onPressInterest = interestName => {
    var interestsMap = this.state.interestsMap;
    var currentState = interestsMap.get(interestName);
    interestsMap.set(interestName, !currentState);
    this.setState({
      interestsMap,
    });
  };

  _renderInterestSquare = ({ item }) => {
    return <InterestSquare interestName={item} />;
  };

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressDone = event => {
    this.props.navigation.navigate('Main');
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
    const { interests, interestsMap } = this.state;
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
        <TouchableOpacity>
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
    height: 370,
  },
});
