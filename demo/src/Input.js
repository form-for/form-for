// @flow

import React from "react";
import { render } from "react-dom";
import type { ComponentProps } from "../../src/Field";

export default class Input extends React.Component<ComponentProps> {
  render() {
    const { error, onMount, ...props } = this.props;

    if (error) {
      // $FlowFixMe
      props["aria-invalid"] = true;
    }

    return <input {...props} />;
  }
}
