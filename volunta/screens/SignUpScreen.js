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
import DatePicker from 'react-native-datepicker'

const today = new Date();

export default class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      birthdate: today,
      email: '',
      password: '',
    };
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ birthdate: newDate });
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
        <DatePicker
          date={this.state.birthdate}
          mode="date"
          placeholder="birthdate"
          format="MM-DD-YYYY"
          minDate="1919-01-01"
          maxDate={today}
          confirmBtnText="confirm"
          cancelBtnText="cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(date) => { this.setState({ birthdate: date }) }}
        />
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