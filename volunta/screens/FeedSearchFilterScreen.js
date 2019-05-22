import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Slider,
  FlatList,
  Button
} from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import _ from 'lodash';
import {
  getAllInterestNames
} from '../firebase/api';

export default class FeedSearchFilterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        minDistance: 1,
        maxDistance: 50,
        currDistance: this.props.navigation.getParam('currDistance'),
    }
  }

  async componentDidMount() {
    this._loadInterests();
    this.props.navigation.setParams({
      currDistance: this.state.currDistance,
      selectedInterests: this.state.interestMap,
    });
  }

  // gets the interests from the database and creates the lines
  // for the advanced search screen
  _loadInterests = async () => {
    listOfInterests = [];
    await getAllInterestNames().then(function(interestsArr){
      interestsArr.forEach(function(interest) {
        let tuple = {key: interest, switch: true}
        listOfInterests.push(tuple)
      });
    });
    this.setState({
      interestMap : listOfInterests
    });
  };

  // creates the search button in the header
  static navigationOptions = ({ navigation }) => ({
    headerRight: 
    <Button title="Search" onPress={() => {
      currDistance = navigation.getParam('currDistance');
      selectedInterests = navigation.getParam('selectedInterests')
      // onAdvancedSearchPressed is the callback from the parent function
      navigation.state.params.onAdvancedSearchPressed([currDistance, selectedInterests]);
      navigation.goBack();
    }} />,
  });

  // handles the logic of toggling switches in state
  _setSwitchValue = (val, ind) => {
    const tempData = _.cloneDeep(this.state.interestMap);
    tempData[ind].switch = val;
    this.setState({ interestMap: tempData });
  }

  // use the index as a string as key
  _keyExtractor = (item, index) => index.toString();

  // displays single line of interests
  _renderInterest = ({ item, index }) => {
    return (
      <View style={styles.interestLine}> 
        <View style={styles.horizontalBar}>
          <Text style={styles.interestText}> {item.key} </Text>
          <Switch 
            style={styles.switch}
            trackColor={'#0081AF'}
            onValueChange={(value) => this._setSwitchValue(value, index)}
            value={item.switch}
          />
        </View> 
      </View> 
    );
  };

  // displays the line separating interests
  _renderSeparator = () => {
    return (
      <View style={styles.listSeparator}/>
    );
  };

  // updates the state to reflect the value of the slider
  _onSliderValueChange = val => {
    this.setState({ currDistance: val })
  }

  // updates the navigation parameters so the parent screen can see the value
  // of the slider. This is only updated on release as opposed to slide because
  // changing the navigation params is slow and expensive
  _onSliderReleased = val => {
    this.props.navigation.setParams({
      currDistance: val,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}> max distance </Text>
        <View style={styles.optionBlock}>
        <View style={styles.sliderBar}>
            <Slider
                style={{ width: '90%', marginVertical: 8}}
                step={1}
                minimumValue={this.state.minDistance}
                maximumValue={this.state.maxDistance}
                value={this.state.currDistance}
                onValueChange={val => this._onSliderValueChange(val)}
                onSlidingComplete={val => this._onSliderReleased(val)}
                thumbTintColor='rgb(252, 228, 149)'
                maximumTrackTintColor='#d3d3d3' 
                minimumTrackTintColor='#0081AF'
            />
            <View style={styles.textCon}>
                <Text style={styles.colorGrey}>{this.state.minDistance} mi</Text>
                <Text style={styles.colorBlue}>
                    {this.state.currDistance + 'mi'}
                </Text>
                <Text style={styles.colorGrey}>{this.state.maxDistance} mi</Text>
            </View>
        </View>
        </View>
        <Text style={styles.header}> interest categories: </Text>
        <View style={styles.optionBlock}>
            <FlatList
                style={styles.flatListStyle}
                renderItem={this._renderInterest}
                ItemSeparatorComponent={this._renderSeparator}
                data={this.state.interestMap}
                keyExtractor={this._keyExtractor}
            />
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  header: {
    fontSize: 24,
    marginTop: 16,
    fontFamily: 'montserrat',
  },
  sliderBar: {
    marginLeft: '7%'
  },
  optionBlock: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#c1c1c1'
  },
  
  textCon: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    color: '#d3d3d3'
  },
  colorBlue: {
    color: '#0081AF'
  },
  interestLine: {
      height: 50,
      justifyContent: 'center'
  },
  horizontalBar: {
    flexDirection: 'row',
    width: '100%'
  },
  interestText: {
      fontFamily: 'montserrat',
      fontSize: 20,
      marginLeft: 6
  },
  switch: {
    position: 'absolute',
    marginLeft: '83%',
    transform: [{ scaleX: 1.1 }, { scaleY: 1 }] 
  },
  listSeparator: {
    height: 1,
    backgroundColor: "#CED0CE",
  },
  flatListStyle: {

  }
});
