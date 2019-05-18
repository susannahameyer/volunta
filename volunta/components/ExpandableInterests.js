import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import ProfilePageInterests from './ProfilePageInterests';

const SIDE_MARGIN = 20;
const SECTIONS = [{}];

/*
This component recieves a list of interests and displays them as an expandable/collapsable list 
if numRows is specified and all interests can not fit in that amount of rows. We use ProfilePageInterests
to displaye the bubbles, and Accordion to create the expandable effect

// Used https://github.com/oblador/react-native-collapsible

Props:
    - numRows: (optional) max number of rows of interests that we want to display.
    - duration: duration of animation in ms.
    - accordionRight: prop for ProfilePageInterests, put button on the right 
*/

export default class ExpandableInterest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      loaded: false,
    };
  }

  _renderInterests = (numRows, split, passWidths, widths) => {
    const { activeSections } = this.state;
    return (
      <ProfilePageInterests
        numRows={numRows}
        collapse={activeSections.length == 1 ? this.collapse : null}
        expand={activeSections.length == 0 ? this.expand : null}
        split={split}
        sideMargin={SIDE_MARGIN}
        passWidths={passWidths}
        passedWidths={widths}
        accordionRight={this.props.accordionRight}
        interests={[
          'public health',
          'public',
          'kids',
          'social good',
          'civics',
          'beach',
          'really long interest that I love',
          'environmental',
          'kids',
          'health things',
          'words',
        ]}
      />
    );
  };

  collapse = () => {
    this._updateSections([]);
  };

  expand = () => {
    this._updateSections([0]);
  };

  _updateSections = activeSections => {
    if (!this.state.loaded) {
      this.setState({ loaded: !this.state.loaded });
    }
    this.setState({ activeSections });
  };

  passWidths = newWidths => {
    this.widths = newWidths;
  };

  _renderHeader = section => {
    if (this.state.activeSections.length == 0) {
      return this._renderInterests(
        this.props.numRows,
        null,
        this.passWidths,
        null
      );
    } else {
      return this._renderInterests(null, this.props.numRows, null, null);
    }
  };

  _renderContent = section => {
    if (this.state.activeSections.length == 0 && !this.state.loaded) {
      return this._renderInterests(0, null, null, this.widths);
    } else {
      return this._renderInterests(
        null,
        -this.props.numRows,
        null,
        this.widths
      );
    }
  };

  render() {
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={activeSections => {}}
        underlayColor={'white'}
        duration={this.props.duration}
      />
    );
  }
}
