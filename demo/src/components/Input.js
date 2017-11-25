// @flow

import React from "react";
import type { ComponentProps } from "../../../src/Field";

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
        {this.renderIcon()}

        {this.renderError()}
      </div>
    );
  }

  renderError() {
    if (!this.props.touched || !this.props.error) return null;
    return <div style={{ color: "#d00" }}>{this.props.error}</div>;
  }

  renderIcon() {
    if (!this.props.touched) return null;

    let icon;
    let color;
    if (this.props.error) {
      icon = "✖";
      color = "#d00";
    } else {
      icon = "✓";
      color = "green";
    }

    return <span style={{ color: color }}> {icon}</span>;
  }
}
