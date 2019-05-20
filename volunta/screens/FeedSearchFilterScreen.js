import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Slider
} from 'react-native';

export default class WelcomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        minDistance: 1,
        maxDistance: 50,
        currDistance: 10,
        interests: []
    }
  }

  // Function we pass to Log In button, pushes login screen onto stack
  _onPressLogIn = event => {
    this.props.navigation.navigate('LogIn')
  };

  // Function we pass to Sign Up button, pushes sign up screen onto stack

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}> Distance </Text>
        <View style={styles.sliderBar}>
            <Slider
                style={{ width: '90%'}}
                step={1}
                minimumValue={this.state.minDistance}
                maximumValue={this.state.maxDistance}
                value={this.state.currDistance}
                onValueChange={val => this.setState({ currDistance: val })}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
  },
  sliderBar: {
    marginLeft: '7%'
  },
  distanceBlock: {
    width: '100%',
  },
  textCon: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  colorGrey: {
    color: '#d3d3d3'
  },
  colorBlue: {
    color: '#0081AF'
  }

});
