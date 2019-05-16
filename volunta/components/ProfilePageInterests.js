import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import InterestBubble from './InterestBubble';

/*
This component recieves a list of interests and dynamically displays them as a list  of bubbles.
We cut down the length of long strings.
If there are more interests that are not displayed (because of numRows) we add a (...) bubble.

Props:
    - numRows: (optional) max number of rows of interests that we want to display.
    - sideMargin: space between component and screen. 2*sideMargin plus the size of the container component should total the screen width
    - interests: list of strings (interests).
*/

const MIN_BUBBLE_SPACING = 7; // Minimum space we want between interest bubbles
const SIDE_EXTRA_MARGIN = 12;
const MAX_WORD_LENGTH = 20;
const TRUNCATED_STR_ENDING = '...';
const SHORTENED_LIST_LAST_ITEM = '. . .'; // Add bubble with this string at the end of the list if we shorten it

export default class ProfilePageInterests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToShow: false,
      widths: new Array(this.props.interests.length),
      numWidthsSet: 0,
      interests: this._cleanUpInterests(this.props.interests),
    };
  }

  // Truncate interests and add the last SHORTENED_LIST_LAST_ITEM to the list (needed to get
  // its component length). Important to implement code that takes this into account.
  _cleanUpInterests = originalInterests => {
    cleanInterests = originalInterests.map(interest => {
      interest = interest.toLowerCase();
      interest =
        interest.length > MAX_WORD_LENGTH - TRUNCATED_STR_ENDING.length
          ? `${interest
              .substring(0, MAX_WORD_LENGTH - TRUNCATED_STR_ENDING.length)
              .trim()}` + TRUNCATED_STR_ENDING
          : interest;
      return interest;
    });
    return [...cleanInterests, SHORTENED_LIST_LAST_ITEM];
  };

  // Called by bubble once rendered
  // Used the first time it renders to get the width of the bubble
  // Note: They are not called in order, that is why we use the bubble id.
  onLayoutGetWidth = (event, bubbleId) => {
    let { widths, numWidthsSet, interests } = this.state;
    if (this.state.readyToShow) return;
    var { x, y, width, height } = event.nativeEvent.layout;
    widths[bubbleId] = width;
    numWidthsSet += 1;
    this.setState({ widths, numWidthsSet });
    if (numWidthsSet == interests.length) {
      this.setState({ readyToShow: true });
    }
  };

  render() {
    const { numRows, sideMargin } = this.props;
    const { readyToShow, widths, interests } = this.state;

    let views = [];

    // TODO: get rid of this logic, it can be integrated into the other logic path.
    if (!readyToShow) {
      // This part is used to render all the components so we can get their widths
      // TODO: make the number of rows be the same before and after the components show up so there is not a weird lag...
      let currRow = [];
      for (let i = 0; i < interests.length; i++) {
        currRow.push(
          <InterestBubble
            key={i}
            id={i}
            interestName={interests[i]}
            onLayout={this.onLayoutGetWidth}
          />
        );
      }
      views.push(
        <View key={0} style={styles.singleInterestRow}>
          {currRow}
        </View>
      );
    } else {
      // At this point we have the widths for all the components, so we can use this
      views = [];
      let currRow = [];
      let currWidth = 0;
      let maxWidth = Dimensions.get('window').width - 2 * sideMargin;

      // Push bubble into current row
      pushBubble = i => {
        currRow.push(
          <InterestBubble
            key={i}
            id={i}
            interestName={interests[i]}
            onLayout={this.onLayoutGetWidth}
            marginRight={MIN_BUBBLE_SPACING}
          />
        );
        currWidth += w;
      };

      // Push row of bubbles
      pushRow = row => {
        views.push(
          <View key={views.length} style={styles.singleInterestRow}>
            {row}
          </View>
        );
        currRow = [];
        currWidth = 0;
      };

      console.log('start');
      for (let i = 0; i < interests.length - 1; i++) {
        // We do interests.length-1 since the last object in the array is the '...' (we forced it in)
        w = widths[i];

        // If we are in the last row
        if (!!views.length && views.length == numRows - 1) {
          // If there are elements left but the element plus the extra would not fit , add the extra
          // push the row, and break
          if (
            i + 1 < interests.length - 1 &&
            currWidth +
            3 * MIN_BUBBLE_SPACING + // before interest, before and after extra
              w +
              widths[widths.length - 1] +
              SIDE_EXTRA_MARGIN >
              maxWidth
          ) {
            pushBubble(interests.length - 1);
            pushRow(currRow);
            break;

            // Otherwise just push the element
          } else {
            pushBubble(i);
          }
        } else {
          // Not on the last row, check if element fits.
          // If it does not, push the current row and start a new one
          // Then add the element.
          if (
            currWidth + MIN_BUBBLE_SPACING + SIDE_EXTRA_MARGIN + w >=
            maxWidth
          ) {
            pushRow(currRow);
          }

          // Add to current row
          pushBubble(i);
        }
      }

      // Push last row if its not empty!
      if (currRow.length > 0) {
        pushRow(currRow);
      }
    }

    return <View>{views}</View>;
  }
}

const styles = StyleSheet.create({
  singleInterestRow: {
    // justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginVertical: 3,
  },
});
