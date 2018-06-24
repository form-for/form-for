// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

export type Props = {
  render: (meta: { errors: Object, showErrors: boolean }) => React.Node
};

export default class Errors extends React.Component<Props> {
  static contextTypes = {
    errors: PropTypes.object,
    showErrors: PropTypes.bool,
    errorReporters: PropTypes.arrayOf(PropTypes.func)
  };

  handleError = (name: string, error: ?string) => {
    this.forceUpdate();
  };

  componentDidMount() {
    this.context.errorReporters.push(this.handleError);
  }

  componentWillUnmount() {
    const reporters = this.context.errorReporters;
    reporters.splice(reporters.indexOf(this.handleError), 1);
  }

  render(): React.Node {
    const { errors, showErrors } = this.context;
    return this.props.render({ errors, showErrors });
  }
}
