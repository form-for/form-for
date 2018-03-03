// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export default class Input extends React.PureComponent<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, touched, ...props } = { ...this.props };
    delete props.onMount;

    return <input ref={el => (this.input = el)} data-error={error} data-touched={touched} {...props} />;
  }
}
