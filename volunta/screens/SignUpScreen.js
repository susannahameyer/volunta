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
      birthdate: '1996-01-01T12:00:00Z',
      community: '',
      email: '',
      password: '',
      errorMessage: null,
      dateset: false,
      firstName: '',
      lastName: '',
    };
  }

  _signUp = async (email, password, birthdate, firstName, lastName) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        let userId = await firebase.auth().currentUser.uid;
        let success = await registerUser(
          userId,
          birthdate,
          firstName,
          lastName
        );
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

  _setDate = date => {
    let birthdate = date + 'T12:00:00Z'; // GMT (add 12 to make sure its the same day in Pacific)
    this.setState({ birthdate });
  };

  render() {
    const {
      errorMessage,
      email,
      password,
      birthdate,
      firstName,
      lastName,
    } = this.state;
    var disabled = true;
    if (!!email && !!password && !!birthdate && !!firstName && !!lastName) {
      disabled = false;
    }

    return (
      <View style={AuthStyle.container}>
        <Image source={AssetFilePaths.logo} style={AuthStyle.logo} />
        {!!errorMessage && <Text style={AuthStyle.error}>{errorMessage}</Text>}
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>first name:</Text>
          <TextInput
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={firstName => this.setState({ firstName })}
            value={firstName}
          />
        </View>
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>last name:</Text>
          <TextInput
            autoCapitalize="none"
            style={AuthStyle.textInput}
            onChangeText={lastName => this.setState({ lastName })}
            value={lastName}
          />
        </View>
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
        <View style={AuthStyle.inputView}>
          <Text style={AuthStyle.inputPromptText}>birthdate:</Text>
          <DatePicker
            date={birthdate}
            mode="date"
            placeholder="birthdate"
            format="YYYY-MM-DD"
            minDate="1919-01-01"
            maxDate={today}
            confirmBtnText="confirm"
            cancelBtnText="cancel"
            customStyles={{
              dateText: {
                fontFamily: 'montserrat',
                fontSize: 16,
              },
              dateInput: {
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderColor: '#979797',
                alignItems: 'flex-start',
              },
            }}
            showIcon={false}
            style={AuthStyle.datePicker}
            onDateChange={this._setDate}
          />
        </View>
        <TouchableOpacity
          onPress={async () =>
            await this._signUp(email, password, birthdate, firstName, lastName)
          }
          disabled={disabled}
        >
          <View
            style={[
              AuthStyle.logInButton,
              {
                backgroundColor: disabled ? 'grey' : '#0081AF',
                marginBottom: 22,
              },
            ]}
          >
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
