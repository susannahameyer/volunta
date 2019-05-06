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
import Colors from '../constants/Colors';
import AssetFilePaths from '../constants/AssetFilePaths';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  // TODO: implement FB Login
  _onPressLogInWithFB = event => { };

  // TODO: implement Google Login
  _onPressLogInWithGoogle = event => { };

  handleLogIn = () => {
    // TODO: Firebase stuff...
    console.log('handleLogIn')
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={AssetFilePaths.logo}
          style={styles.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressLogInWithFB}>
            <View style={styles.socialButton}>
              <Text style={styles.buttonText}>log in with facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressLogInWithGoogle}>
            <View style={styles.socialButton}>
              <Text style={styles.buttonText}>log in with google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.inputView}>
          <Text styles={styles.inputPromptText}>email:</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
        </View>
        <View style={styles.inputView}>
          <Text styles={styles.inputPromptText}>password:</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        <TouchableOpacity onPress={this.handleLogIn}>
          <View style={styles.logInButton}>
            <Text style={styles.buttonText}>log in</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Don't have an account? Sign up"
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    height: 3,
    marginTop: 20,
    width: 306,
  },
  inputView: {
    marginTop: 20,
  },
  logInButton: {
    alignItems: 'center',
    backgroundColor: '#0081AF',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.5,
    width: 167,
  },
  logo: {
    width: 234,
    height: 223,
    resizeMode: 'contain',
  },
  inputPromptText: {
    color: Colors.mediumGray,
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: 'normal',
    marginLeft: 0,
    marginTop: 20,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: '#0081AF',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.5,
    width: 306,
  },
  textInput: {
    height: 40,
    width: 306,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 2,
  },
});