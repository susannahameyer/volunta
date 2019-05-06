import React from 'react';
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AssetFilePaths from '../constants/AssetFilePaths';
import AuthStyle from '../stylesheets/AuthStyle';

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
      <View style={AuthStyle.container}>
        <Image
          source={AssetFilePaths.logo}
          style={AuthStyle.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressSignUpWithFB}>
            <View style={AuthStyle.socialButton}>
              <Text style={AuthStyle.buttonText}>sign up with facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressSignUpWithGoogle}>
            <View style={AuthStyle.socialButton}>
              <Text style={AuthStyle.buttonText}>sign up with google</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={AuthStyle.divider} />
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>email:</Text>
          <TextInput
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
        </View>
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>password:</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        <TouchableOpacity onPress={this.handleSignUp}>
          <View style={AuthStyle.logInButton}>
            <Text style={AuthStyle.buttonText}>sign up</Text>
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