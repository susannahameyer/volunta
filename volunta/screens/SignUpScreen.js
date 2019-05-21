import React from 'react';
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthStyle from '../stylesheets/AuthStyle';
import AssetFilePaths from '../constants/AssetFilePaths';
import DatePicker from 'react-native-datepicker';
import * as firebase from 'firebase';
import { registerUser } from '../firebase/api';

const today = new Date();

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birthdate: today,
      community: '',
      email: '',
      password: '',
      errorMessage: null,
    };
  }

  // TODO: implement FB Sign in
  _onPressSignUpWithFB = event => {};

  // TODO: implement Google Sign in
  _onPressSignUpWithGoogle = event => {};

  _signUp = async (email, password, birthdate) => {
    console.log('SIGNUP');
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        let userId = await firebase.auth().currentUser.uid;
        let success = await registerUser(userId, birthdate);
        if (success) this.props.navigation.navigate('NUX');
        else
          this.setState({ errorMessage: 'Error communicating with database' });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({ errorMessage });
      });
  };

  render() {
    const { errorMessage, email, password, birthdate } = this.state;
    return (
      <View style={AuthStyle.container}>
        <Image source={AssetFilePaths.logo} style={AuthStyle.logo} />
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
        {!!errorMessage && <Text style={AuthStyle.error}>{errorMessage}</Text>}
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>email:</Text>
          <TextInput
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={email => this.setState({ email })}
            value={email}
          />
        </View>
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>password:</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={password => this.setState({ password })}
            value={password}
          />
        </View>
        <DatePicker
          date={birthdate}
          mode="date"
          placeholder="birthdate"
          format="MM-DD-YYYY"
          minDate="1919-01-01"
          maxDate={today}
          confirmBtnText="confirm"
          cancelBtnText="cancel"
          customStyles={{
            dateText: {
              fontFamily: 'montserrat',
            },
          }}
          showIcon={false}
          style={AuthStyle.datePicker}
          onDateChange={date => {
            this.setState({ birthdate: date });
          }}
        />
        <TouchableOpacity
          onPress={async () => await this._signUp(email, password, birthdate)}
        >
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
