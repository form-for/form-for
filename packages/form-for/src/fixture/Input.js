// @flow

import * as React from "react";
import type { ComponentProps } from "../index";

export type Props = {
  ref?: Function
} & ComponentProps;

export default class Input extends React.Component<Props> {
  input: ?HTMLInputElement;

  handleRef = (el: ?HTMLInputElement) => {
    this.input = el;

    if (this.props.ref) {
      this.props.ref(el);
    }
  };

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, touched, onMount, ...props } = { ...this.props };

    return <input ref={this.handleRef} data-error={error} data-touched={touched} {...props} />;
  }
}
