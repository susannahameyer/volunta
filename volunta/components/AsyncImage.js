// Code from: https://github.com/wmcbain/react-native-async-image-tutorial/blob/part-1/AsyncImage.js

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Image, View } from 'react-native';

type Style = number | string | Object | Array<?Style>;

type Props = {
  placeholderColor?: string,
  style: {
    width: number,
    height: number,
    [key: string]: Style
  },
  source: {
    uri: string
  }
};

type State = {
  loaded: boolean
};

export default class AsyncImage extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = { loaded: false };
  }

  render() {
    const { placeholderColor, imgStyle, viewStyle, source } = this.props;

    return (
      <View style={viewStyle}>
        <Image
          source={source}
          style={[
            imgStyle,
            {
              position: 'absolute',
              height: '100%',
              width: '100%'
            }
          ]}
          onLoad={this._onLoad}
        />

        {!this.state.loaded && (
          <View
            style={[
              imgStyle,
              {
                backgroundColor: placeholderColor || '#90a4ae',
                position: 'absolute',
                height: '100%',
                width: '100%'
              }
            ]}
          />
        )}
      </View>
    );
  }

  _onLoad = () => {
    this.setState(() => ({ loaded: true }));
  };
}
