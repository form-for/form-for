// @flow

import React from "react";
import type { ComponentProps } from "../../src/Field";

export default class Input extends React.Component<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { touched, error, onMount, ...props } = this.props;

    if (error) {
      // $FlowFixMe
      props["aria-invalid"] = true;
    }

    return (
      <div>
        <input ref={el => (this.input = el)} {...props} />
        {touched && error && <div style={{ color: "#d00" }}> {error}</div>}
        {touched && !error && <span style={{ color: "green" }}>✓</span>}
      </div>
    );
  }
}
