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
      <View style={AuthStyle.container}>
        <Image
          source={AssetFilePaths.logo}
          style={AuthStyle.logo}
        />
        <View>
          <TouchableOpacity onPress={this._onPressLogInWithFB}>
            <View style={AuthStyle.socialButton}>
              <Text style={AuthStyle.buttonText}>log in with facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressLogInWithGoogle}>
            <View style={AuthStyle.socialButton}>
              <Text style={AuthStyle.buttonText}>log in with google</Text>
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
        <TouchableOpacity onPress={this.handleLogIn}>
          <View style={AuthStyle.logInButton}>
            <Text style={AuthStyle.buttonText}>log in</Text>
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