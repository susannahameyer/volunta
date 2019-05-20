import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { getAllCommunityNames } from '../firebase/api';

export default class NUXCommunityScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      picked: null,
      communities: [],
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const communityNames = await getAllCommunityNames();
    const communities = communityNames.map(name => {
      return {
        key: name,
        label: name,
      };
    });
    this.setState({
      communities,
    });
  };

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressContinue = event => {
    this.props.navigation.navigate('Interests');
  };

  _onShow = () => {
    this.setState({ visible: true });
  };

  _onSelect = picked => {
    this.setState({
      picked: picked,
      visible: false,
    });
  };

  _onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, picked, communities } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to volunta!</Text>
        <Text style={styles.detailText}>
          Please choose the community you want to register your account with.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._onShow}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>select a community</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.selectedLabel}>Selected:</Text>
        <Text style={styles.selectedCommunity}>{picked}</Text>
        <ModalFilterPicker
          visible={visible}
          onSelect={this._onSelect}
          onCancel={this._onCancel}
          options={communities}
        />
        <View style={styles.continueButtonContainer}>
          <TouchableOpacity onPress={this._onPressContinue}>
            <View style={styles.button}>
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
    marginHorizontal: 25,
  },
  welcomeText: {
    fontFamily: 'montserrat',
    fontSize: 24,
    marginTop: 60,
  },
  detailText: {
    textAlign: 'center',
    fontFamily: 'montserrat',
    fontSize: 24,
    marginTop: 35,
  },
  buttonContainer: {
    // flex: 1,
  },
  continueButtonContainer: {
    marginTop: 100,
  },
  selectedLabel: {
    fontFamily: 'montserrat',
    fontSize: 16,
    marginTop: 10,
  },
  selectedCommunity: {
    fontFamily: 'montserrat-bold',
    fontSize: 16,
    marginTop: 10,
  },
});
