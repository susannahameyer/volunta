import React from 'react';
import {
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../constants/Colors';


export default class SignUpScreen extends React.Component {

  // TODO: implement FB Sign in
  _onPressSignUpWithFB = event => {  };

  // TODO: implement Google Sign in
  _onPressSignUpWithGoogle = event => {  };

  render() {
    return (
        <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressSignUpWithFB}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>sign up with facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressSignUpWithGoogle}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>sign up with google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />;
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
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
      opacity: 0.5,
      width: 306,
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
    divider: {
      backgroundColor: Colors.mediumGray,
      height: 1,
    },
    logo: {
      width: 234,
      height: 223,
      resizeMode: 'contain',
    },
  });