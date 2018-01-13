// @flow

import * as React from "react";
import type { ComponentProps } from "../../index";

export type Props = {
  ref?: Function
} & ComponentProps;

export default class Input extends React.PureComponent<Props> {
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
    if (error) props["aria-invalid"] = true;

    return <input ref={this.handleRef} {...props} />;
  }
}
