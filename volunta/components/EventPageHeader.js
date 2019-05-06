import React from 'react';
import { Image, StyleSheet, Text, Dimensions, View } from 'react-native';
// import { Divider } from 'react-native-elements';

export default class EventPageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      eventTitle,
      organizationName,
      organizationLogo,
      coverPhoto,
    } = this.props;
    return (
      <View>
        <View style={styles.shadow}>
          <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
        </View>
        <View style={styles.divider}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.eventTitle}>{eventTitle}</Text>
                <Text style={styles.orgName}>{organizationName}</Text>
              </View>
              <Image source={{ uri: organizationLogo }} style={styles.logo} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  coverPhoto: {
    width: Dimensions.get('window').width,
    height: 181,
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
  },
  divider: {
    paddingBottom: 10,
    borderBottomColor: '#DADADA',
    borderBottomWidth: 1,
  },
  container: {
    width: Dimensions.get('window').width,
    marginHorizontal: 35,
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
  },
  logo: {
    width: 74,
    height: 74,
    borderRadius: 37,
    marginRight: 15,
    marginBottom: 0,
    marginTop: 15,
    alignSelf: 'center',
  },
  headerText: {
    marginTop: 15,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: 'montserrat',
    width: 235,
  },
  orgName: {
    fontSize: 14,
    color: '#838383',
    fontFamily: 'montserrat',
    marginTop: 5,
    width: 235,
  },
});
