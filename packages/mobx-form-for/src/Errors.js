// @flow

import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { ErrorsProps } from 'form-for';

class Errors extends React.Component<ErrorsProps> {
  static contextTypes = {
    errors: MobxPropTypes.observableMap,
    showErrors: PropTypes.bool,
    submitted: PropTypes.any
  };

  render(): React.Node {
    const { errors, showErrors, submitted } = this.context;
    return this.props.render({ errors, showErrors: showErrors || submitted.get() });
  }
}

export default observer(Errors);
