import Colors from '../constants/Colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  datePicker: {
    marginTop: 20,
    width: 306,
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
    color: Colors.darkGray,
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: 'normal',
    marginLeft: 0,
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