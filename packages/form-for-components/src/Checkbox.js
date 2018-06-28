// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export default class Checkbox extends React.PureComponent<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, value, ...props } = { ...this.props };
    delete props.onMount;
    delete props.touched;
    delete props.validating;

    return <input ref={el => (this.input = el)} {...props} checked={!!value} aria-invalid={!!error} type="checkbox" />;
  }
}
