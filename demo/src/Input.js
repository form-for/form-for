// @flow

import React from "react";
import type { ComponentProps } from "../../src/Field";

export default class Input extends React.Component<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { valid, error, waiting, onMount, ...props } = this.props;

    if (error) {
      // $FlowFixMe
      props["aria-invalid"] = true;
    }

    return (
      <div>
        <input ref={el => (this.input = el)} {...props} />
        {error && !waiting && <div style={{ color: "#d00" }}> {error}</div>}

        {waiting && "waiting ⌛"}
        {valid && <span style={{ color: "green" }}>✓</span>}
      </div>
    );
  }
}
