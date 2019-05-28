import React from 'react';
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import AssetFilePaths from '../constants/AssetFilePaths';
import AuthStyle from '../stylesheets/AuthStyle';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  _logIn = async (email, password) => {
    await firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            this.props.navigation.navigate('Main');
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({ errorMessage });
          });
      });
  };

  render() {
    const { errorMessage, email, password } = this.state;
    var disabled = true;
    if (!!email && !!password) {
      disabled = false;
    }

    return (
      <KeyboardAvoidingView style={AuthStyle.container} behavior="padding">
        <Image
          source={AssetFilePaths.logo}
          style={[AuthStyle.logo, { marginBottom: 50 }]}
        />
        {!!errorMessage && <Text style={AuthStyle.error}>{errorMessage}</Text>}
        <View style={[AuthStyle.inputView, { marginBottom: 20 }]}>
          <Text style={AuthStyle.inputPromptText}>email:</Text>
          <TextInput
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={email => this.setState({ email })}
            value={email}
          />
        </View>
        <View style={[AuthStyle.inputView, { marginBottom: 100 }]}>
          <Text style={AuthStyle.inputPromptText}>password:</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={password => this.setState({ password })}
            value={password}
          />
        </View>
        <TouchableOpacity
          onPress={() => this._logIn(email, password)}
          disabled={disabled}
        >
          <View
            style={[
              AuthStyle.logInButton,
              {
                marginBottom: 20,
                backgroundColor: disabled ? 'grey' : '#0081AF',
              },
            ]}
          >
            <Text style={AuthStyle.buttonText}>log in</Text>
          </View>
        </TouchableOpacity>
        <Button
          title="Don't have an account? Sign up"
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </KeyboardAvoidingView>
    );
  }
}
