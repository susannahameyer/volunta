import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../constants/Colors';


export default class SignUpScreen extends React.Component {

  render() {
    return (
        <View style={styles.container}>
        <Image
          source={require(assetFilePath + 'logo.png')}
          style={styles.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressLogIn}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>sign up with facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressSignUp}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>sign up with google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Divider style={{ backgroundColor: Colors.mediumGray }} />;
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
      color: "#FFFFFF",
      fontFamily: 'montserrat',
      fontSize: 18,
      fontWeight: 'normal',
    },
    container: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    logo: {
      width: 234,
      height: 223,
      resizeMode: 'contain',
    },
  });