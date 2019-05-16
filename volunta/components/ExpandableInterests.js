import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import ProfilePageInterests from './ProfilePageInterests';

const SIDE_MARGIN = 20;
const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
];

export default class ExpandableInterest extends Component {
  state = {
    activeSections: [],
  };

  _renderInterests = (numRows, split, passWidths, widths) => {
    return (
      <ProfilePageInterests
        numRows={numRows}
        split={split}
        sideMargin={SIDE_MARGIN}
        passWidths={passWidths}
        passedWidths={widths}
        interests={[
          'public health',
          'public',
          'social good',
          'really long interest that I love',
          'kids',
          'civics',
          'environmental',
          'beach',
          'kids',
          'health things',
          'words',
        ]}
      />
    );
  };

  // TODO: change 2 to NUM_ROWS

  passWidths = newWidths => {
    this.widths = newWidths;
  };

  _renderHeader = section => {
    if (this.state.activeSections.length == 0) {
      return this._renderInterests(2, null, this.passWidths, null);
    } else {
      return this._renderInterests(null, 2, null, null);
    }
  };

  _renderContent = section => {
    numRows = this.state.activeSections.length == 0 ? 0 : null;
    split = this.state.activeSections.length == 0 ? null : -2;
    return this._renderInterests(numRows, split, null, this.widths);
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//     paddingTop: Constants.statusBarHeight,
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: 22,
//     fontWeight: '300',
//     marginBottom: 20,
//   },
//   header: {
//     backgroundColor: '#F5FCFF',
//     padding: 10,
//   },
//   headerText: {
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   content: {
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   active: {
//     backgroundColor: 'rgba(255,255,255,1)',
//   },
//   inactive: {
//     backgroundColor: 'rgba(245,252,255,1)',
//   },
//   selectors: {
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   selector: {
//     backgroundColor: '#F5FCFF',
//     padding: 10,
//   },
//   activeSelector: {
//     fontWeight: 'bold',
//   },
//   selectTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     padding: 10,
//   },
//   multipleToggle: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 30,
//     alignItems: 'center',
//   },
//   multipleToggle__title: {
//     fontSize: 16,
//     marginRight: 8,
//   },
// });
