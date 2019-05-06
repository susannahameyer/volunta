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


export default class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  // TODO: implement FB Sign in
  _onPressSignUpWithFB = event => { };

  // TODO: implement Google Sign in
  _onPressSignUpWithGoogle = event => { };

  handleSignUp = () => {
    // TODO: Firebase stuff...
    console.log('handleSignUp')
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require(AssetFilePaths.logo)}
          style={styles.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressSignUpWithFB}>
            <View style={styles.socialButton}>
              <Text style={styles.buttonText}>sign up with facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressSignUpWithGoogle}>
            <View style={styles.socialButton}>
              <Text style={styles.buttonText}>sign up with google</Text>
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
        <TouchableOpacity onPress={this.handleSignUp}>
          <View style={styles.signUpButton}>
            <Text style={styles.buttonText}>sign up</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('LogIn')}
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
  signUpButton: {
    alignItems: 'center',
    backgroundColor: '#0081AF',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.5,
    width: 167,
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