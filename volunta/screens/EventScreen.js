import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import EventPageHeader from '../components/EventPageHeader';
import EventPageButtonBar from '../components/EventPageButtonBar';
import EventPageAboutSection from '../components/EventPageAboutSection';
import Facepile from '../components/Facepile';
import { firestore } from '../firebase/firebase';
import {
  getUsersAttributes,
  getOrganizationName,
  getOrganizationLogo,
} from '../firebase/api';

export default class EventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.navigation.getParam('event'),
      interested: this.props.navigation.getParam('interested'),
      attendees: [],
      refreshing: true,
      org_name: this.props.navigation.getParam('org_name'),
      org_logo: '../assets/images/logo.png', //This never actually renders, but avoids empty string warnings.
    };
  }

  async componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const org_ref = this.state.event.org_ref;

    const [org_logo, attendees] = await Promise.all([
      getOrganizationLogo(org_ref),
      firestore
        .collection('users')
        .get()
        .then(
          async snapshot =>
            await getUsersAttributes(snapshot.docs, ['name', 'profile_pic_url'])
        ),
    ]);

    this.setState({
      attendees: attendees,
      refreshing: false,
      org_logo: org_logo,
    });
  };

  // TODO: get event info needed to pass to different components, all hard-coded for now
  // Title, organization name, organization logo, event cover photo --> EventPageHeader
  // Whether current user is interested / going --> EventPageButtonBar
  // Event from_date and to_date --> EventPageAboutSection
  // userIDs of users attending / interested --> Facepile + number in user's community
  render() {
    const {
      event,
      interested,
      attendees,
      refreshing,
      org_name,
      org_logo,
    } = this.state;
    if (!refreshing) {
      return (
        <ScrollView>
          <EventPageHeader
            eventTitle={event.title}
            organizationName={org_name}
            organizationLogo={org_logo}
            coverPhoto={event.cover_url}
          />
          <EventPageButtonBar interested={interested} going={true} />
          <EventPageAboutSection
            fromDate={event.from_date}
            toDate={event.to_date}
            location={event.location}
          />
          <View style={styles.divider}>
            <View style={styles.facepileContainer}>
              <Text style={styles.sectionText}>{"Who's going?"}</Text>
              {attendees !== [] && (
                <Facepile
                  totalWidth={335}
                  maxNumImages={10}
                  imageDiameter={50}
                  members={attendees}
                  pileTitle="Event Attendees"
                  navigation={this.props.navigation}
                />
              )}
              <Text style={[styles.detailText, styles.numGoingText]}>
                {'84 going or interested including 36 from your community'}
              </Text>
            </View>
          </View>
          <View style={styles.facepileContainer}>
            <Text style={styles.sectionText}>{'Details'}</Text>
            <Text style={styles.detailText}>
              {
                "American Lung Association's annual Fight For Air Climb is coming up on June 1st at 555 California Street in San Francisco!! We need help with registration, food, kids crafts, cheering on our climbers, event set-up and take down, and more. Please reach out to us if you are interested!\n\nThe Fight For Air Climb, a competitive stair climb to the top of a skyscraper, is an opportunity for the American Lung Association and the Bay Area community to rally together and raise funds to support lung disease research, anti-tobacco policies, and clean air initiatives. \n\nCOME JOIN US! Register as a Volunteer at http://FightForAirClimb.org/SanFrancisco"
              }
            </Text>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size={0} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#DADADA',
    borderBottomWidth: 1,
  },
  facepileContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionText: {
    fontSize: 18,
    fontFamily: 'montserrat-bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'montserrat',
  },
  numGoingText: {
    marginTop: 10,
    marginBottom: 3,
  },
  activityIndicator: {
    marginTop: 300,
  },
});
