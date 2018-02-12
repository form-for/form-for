// @flow

import * as React from 'react';

export default class Counter extends React.Component<*> {
  count = 0;

  render() {
    return <input name={this.props.name} data-count={++this.count} />;
  }
}
