import React from 'react';
import { Image, StyleSheet, Text, Dimensions, View } from 'react-native';
/*
This component displays at the header of a single event page.

Props:
    - eventTitle
    - organizationName
    - organizationLogo
    - coverPhoto
*/

export default class EventPageHeader extends React.Component {
  render() {
    const {
      eventTitle,
      organizationName,
      organizationLogo,
      coverPhoto,
    } = this.props;
    return (
      <View>
        <View>
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
  divider: {
    borderBottomColor: '#DADADA',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingBottom: 10,
  },
  container: {
    width: Dimensions.get('window').width,
    marginHorizontal: 20,
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
    marginTop: 15,
    marginLeft: 10,
    alignSelf: 'center',
  },
  headerText: {
    marginTop: 15,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: 'raleway-medium',
    width: 235,
  },
  orgName: {
    fontSize: 14,
    color: '#838383',
    fontFamily: 'raleway',
    marginTop: 5,
    width: 235,
  },
});
