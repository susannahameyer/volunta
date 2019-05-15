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
const SIDE_EXTRA_MARGIN = 4;
const MAX_WORD_LENGTH = 20;
const TRUNCATED_STR_ENDING = '...';
const SHORTENED_LIST_LAST_ITEM = '.  .  .'; // Add bubble with this string at the end of the list if we shorten it

export default class ProfilePageInterests extends React.Component {
  constructor(props) {
    super(props);
    // ADD '...' to interests!
    this.state = {
      readyToShow: false,
      widths: new Array(this.props.interests.length),
      numWidthsSet: 0,
      interests: this._cleanUpInterests(this.props.interests),
    };
  }

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
        if (i % 3 == 0) {
          currRow = [];
        }
        currRow.push(
          <InterestBubble
            key={i}
            id={i}
            interestName={interests[i]}
            onLayout={this.onLayoutGetWidth}
          />
        );

        if ((i - 1) % 3 == 0) {
          views.push(
            <View key={i} style={styles.singleInterestRow}>
              {currRow}
            </View>
          );
        }
      }
    } else {
      // At this point we have the widths for all the components, so we can use ths
      let currRow = [];
      let currWidth = 0;
      let maxWidth = Dimensions.get('window').width - 2 * sideMargin;

      // TODO: better index for row?
      pushRow = (row, i) => {
        views.push(
          <View key={i} style={styles.singleInterestRow}>
            {row}
          </View>
        );
      };

      for (let i = 0; i < interests.length - 1; i++) {
        // We do interests.length-1 since the last object in the array is the '...' (we forced it in)
        w = widths[i];

        // If it does not fit: push row and initialize a new row
        if (
          currWidth + MIN_BUBBLE_SPACING + SIDE_EXTRA_MARGIN + w >=
          maxWidth
        ) {
          pushRow(currRow, i);
          currRow = [];
          currWidth = 0;
        }

        // Add to current row
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
        // TODO: break when we do not need more rows
      }

      // Push last row if its not empty!
      if (currRow.length > 0) {
        pushRow(currRow, interests.length);
      }

      // if (!!views.length && views.length == numRows) {
      //       console.log('BREAKING');
      //       break;
      //     }
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
