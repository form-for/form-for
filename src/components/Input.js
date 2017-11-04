// @flow

import * as React from "react";
import type { ComponentProps } from "./ComponentProps.flow";

export type Props = {
  type?: string
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
    const { error, onMount, ...props } = { ...this.props };
    return <input ref={this.handleRef} {...props} />;
  }
}
