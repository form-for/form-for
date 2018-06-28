// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export default class Input extends React.PureComponent<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, ...props } = { ...this.props };
    delete props.onMount;
    delete props.touched;
    delete props.validating;

    return <input ref={el => (this.input = el)} aria-invalid={!!error} {...props} />;
  }
}
