// @flow

import * as React from 'react';

type Props = {
  id: ?string,
  text: ?string
};

export default class Help extends React.Component<Props> {
  render() {
    if (!this.props.text) return null;

    return (
      <small id={this.props.id} className="form-text text-muted">
        {this.props.text}
      </small>
    );
  }
}
