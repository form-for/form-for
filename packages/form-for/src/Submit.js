// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

export type Props = {
  render: (submitting: boolean) => React.Node
};

export default class Submit extends React.Component<Props> {
  static contextTypes = {
    submitting: PropTypes.bool.isRequired
  };

  render(): React.Node {
    return this.props.render(this.context.submitting.get());
  }
}
