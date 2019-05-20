import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import InterestBubble from './InterestBubble';

/*
This component recieves a list of interests and dynamically displays them as a list  of bubbles.
We cut down the length of long strings.
If there are more interests that are not displayed (because of numRows) we add a (...) bubble.

Props:
    - numRows: (optional) max number of rows of interests that we want to display.
    - sideMargin: space between component and screen. 2*sideMargin plus the size of the container component should total the screen width
    - interests: list of strings (interests).
    - passWidths: (optional) functioned passed if parent wants the widths of all bubbles
    - passedWidths: (optional) pass if widths of bubbles are precalculated
    - collapse: function passed if component is child of accordion and we need to collapse
    - expand: function passed if component is child of accordion and we need to expand
    - accordionRight: put accordion (+) button on the right instead of on the left
*/

const MIN_BUBBLE_SPACING = 7; // Minimum space we want between interest bubbles
const SIDE_EXTRA_MARGIN = 12;
const MAX_WORD_LENGTH = 20;
const TRUNCATED_STR_ENDING = '...';
const ACCORDION = '+';
const SHORTENED_LIST_LAST_ITEM = '. . .'; // Add bubble with this string at the end of the list if we shorten it

export default class ProfilePageInterests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToShow: false,
      widths: new Array(props.interests.length),
      numWidthsSet: 0,
      interests: props.interests,
      updatedInterests: false,
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
    return [ACCORDION, ...cleanInterests, SHORTENED_LIST_LAST_ITEM];
  };

  // Called by bubble once rendered
  // Used the first time it renders to get the width of the bubble
  // Note: They are not called in order, that is why we use the bubble id.
  onLayoutGetWidth = (event, bubbleId) => {
    let {
      widths,
      numWidthsSet,
      interests,
      readyToShow,
      updatedInterests,
    } = this.state;
    _interests = this._cleanUpInterests(interests);
    if (readyToShow && !updatedInterests) return;
    var { x, y, width, height } = event.nativeEvent.layout;
    widths[bubbleId] = width;
    numWidthsSet += 1;
    this.setState({ widths, numWidthsSet });
    if (numWidthsSet == _interests.length) {
      this.setState({ readyToShow: true, updatedInterests: false });
    }
  };

  // Update interests in state if interests from props change.
  // Note that for the way the component is implemented interests must be part of the state.
  // Return object that we want to update state with.
  // We check if the interests are different.
  static getDerivedStateFromProps(props, state) {
    if (
      props.interests.length != state.interests.length &&
      props.interests.length > 0
    ) {
      return {
        interests: props.interests,
        updatedInterests: true,
      };
    } else return null;
  }

  render() {
    const {
      numRows,
      sideMargin,
      split,
      passWidths,
      passedWidths,
      collapse,
      expand,
      accordionRight,
    } = this.props;
    const { readyToShow, widths, interests } = this.state;
    _interests = this._cleanUpInterests(interests);

    // Set widths to passedWidths if they are set, otherwise use from state
    usedWidths = widths;
    if (!!passedWidths) {
      usedWidths = passedWidths;
    }

    let views = []; // Rows we will show
    if (!readyToShow) {
      // This part is used to render all the components so we can get their widths
      let currRow = [];
      for (let i = 0; i < _interests.length; i++) {
        currRow.push(
          <InterestBubble
            key={i}
            id={i}
            interestName={_interests[i]}
            onLayout={this.onLayoutGetWidth}
          />
        );
      }
      views.push(
        <View key={0} style={[styles.singleInterestRow, { opacity: 0 }]}>
          {currRow}
        </View>
      );
    } else {
      if (!!passWidths) {
        passWidths(usedWidths);
      }

      // At this point we have the widths for all the components, so we can use this
      views = [];
      let currRow = [];
      let currWidth = 0;
      let maxWidth = Dimensions.get('window').width - 2 * sideMargin;

      // Push bubble into current row
      pushBubble = (i, isExtra) => {
        // Logic to decide if we want to make button pressable
        let onPress = null;
        if (i == 0) {
          if (!!expand) {
            onPress = expand;
          } else if (!!collapse) {
            onPress = collapse;
          }
        }

        currRow.push(
          <InterestBubble
            onPress={onPress}
            key={i}
            id={i}
            interestName={i == 0 ? (!!collapse ? '-' : '+') : _interests[i]}
            onLayout={this.onLayoutGetWidth}
            marginRight={MIN_BUBBLE_SPACING}
            extraTextStyles={i == 0 ? styles.accordionTextStyle : null}
            extraBubbleStyles={i == 0 ? styles.accordionBubbleStyle : null}
          />
        );
        currWidth += w;
      };

      // Push row of bubbles
      pushRow = row => {
        views.push(row);
        currRow = [];
        currWidth = 0;
      };

      let needExpand = false;
      for (let i = 0; i < _interests.length - 1; i++) {
        // We do interests.length-1 since the last object in the array is the '...' (we forced it in)
        w = usedWidths[i];

        // If we are in the last row
        if (!!views.length && views.length == numRows - 1) {
          // If there are elements left but the element plus the extra would not fit , add the extra
          // push the row, and break
          if (
            i + 1 < _interests.length - 1 &&
            currWidth +
            3 * MIN_BUBBLE_SPACING + // before interest, before and after extra
              w +
              usedWidths[usedWidths.length - 1] +
              SIDE_EXTRA_MARGIN >
              maxWidth
          ) {
            // Add extra and break
            pushBubble(_interests.length - 1, true);
            pushRow(currRow);
            needExpand = true;
            break;

            // Otherwise just push the element
          } else {
            pushBubble(i, false);
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
          pushBubble(i, false);
        }
      }

      // Push last row if its not empty!
      if (currRow.length > 0) {
        pushRow(currRow);
      }

      if (!needExpand && !collapse) {
        // This implies nothing was added in other than ACCORDION
        if (views.length == 1 && views[0].length == 1) {
          views = [];
        } else {
          views[0] = views[0].slice(1, views[0].length);
        }
      }

      // Convert views from array of arrays to array of views
      views = views.map((row, index) => {
        if (accordionRight && index == 0 && (needExpand || !!collapse)) {
          row.push(row.shift());
          return (
            <View
              key={index}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <View style={styles.singleInterestRow}>
                {row.slice(0, row.length - 1)}
              </View>
              <View style={styles.singleInterestRow}>
                {row[row.length - 1]}
              </View>
            </View>
          );
        }
        return (
          <View key={index} style={styles.singleInterestRow}>
            {row}
          </View>
        );
      });
    }

    if (!!split) {
      if (split > 0) {
        return <View>{views.slice(0, split)}</View>;
      } else {
        return <View>{views.slice(-split, views.length)}</View>;
      }
    } else {
      return <View>{views}</View>;
    }
  }
}

const styles = StyleSheet.create({
  singleInterestRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  accordionBubbleStyle: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderColor: '#0081AF',
  },
  accordionTextStyle: {
    color: '#0081AF',
    fontSize: 20,
    marginHorizontal: 0,
  },
});
