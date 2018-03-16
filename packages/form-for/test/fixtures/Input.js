// @flow

import * as React from 'react';
import type { ComponentProps } from '../../src';

export default class Input extends React.Component<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, touched, validating, ...props } = { ...this.props };
    delete props.onMount;

    return (
      <input
        ref={el => (this.input = el)}
        data-error={error}
        data-touched={touched}
        data-validating={validating}
        {...props}
      />
    );
  }
}
