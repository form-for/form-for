// @flow

import * as React from "react";
import type { ComponentProps } from "../index";

export default class Input extends React.Component<ComponentProps> {
  input: ?HTMLInputElement;

  handleRef = (el: ?HTMLInputElement) => {
    this.input = el;
  };

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, touched, onMount, ...props } = { ...this.props };

    return <input ref={this.handleRef} data-error={error} data-touched={touched} {...props} />;
  }
}
