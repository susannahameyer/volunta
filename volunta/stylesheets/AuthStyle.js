import Colors from '../constants/Colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'raleway',
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
    width: 306,
    marginBottom: 20,
  },
  divider: {
    backgroundColor: Colors.mediumGray,
    height: 3,
    marginTop: 20,
    width: 306,
  },
  inputView: {
    marginTop: 30,
  },
  logInButton: {
    alignItems: 'center',
    backgroundColor: '#0081AF',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginTop: 20,
    width: 167,
  },
  logo: {
    width: 133,
    height: 118,
    resizeMode: 'contain',
  },
  inputPromptText: {
    color: Colors.darkGray,
    fontFamily: 'raleway',
    fontSize: 16,
    color: '#979797',
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
    height: 26,
    width: 306,
    borderColor: '#979797',
    borderWidth: 1,
    marginTop: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    fontFamily: 'raleway',
    fontSize: 15,
  },
  error: {
    color: 'red',
    fontFamily: 'raleway',
    fontSize: 12,
  },
});
