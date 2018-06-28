// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export default class TextArea extends React.PureComponent<ComponentProps> {
  textarea: ?HTMLTextAreaElement;

  componentDidMount() {
    this.props.onMount(this.textarea);
  }

  render() {
    const { error, ...props } = { ...this.props };
    delete props.onMount;
    delete props.touched;
    delete props.validating;

    return <textarea ref={el => (this.textarea = el)} aria-invalid={!!error} {...props} />;
  }
}
