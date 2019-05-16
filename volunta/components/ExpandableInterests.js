import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import ProfilePageInterests from './ProfilePageInterests';

const SIDE_MARGIN = 20;
const SECTIONS = [{}];

// TODO: comment this component
// Used https://github.com/oblador/react-native-collapsible
// TODO: fetch from db
// TODO: only expand when (...) is clicked?
export default class ExpandableInterest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      loaded: false,
    };
  }

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
  // TODO: make content clickable to collapse?

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
    if (this.state.activeSections.length == 0 && !this.state.loaded) {
      return this._renderInterests(0, null, null, this.widths);
    } else {
      return this._renderInterests(null, -2, null, this.widths);
    }
  };

  _updateSections = activeSections => {
    if (!this.state.loaded) {
      this.setState({ loaded: !this.state.loaded });
    }
    this.setState({ activeSections });
  };

  render() {
    // TODO: only make it an accordion if there are extra items to show...
    // Use 'disabled' prop
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
        underlayColor={'white'}
        duration={1000}
      />
    );
  }
}
