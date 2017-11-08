// @flow

import React from "react";
import { render } from "react-dom";
import type { ComponentProps } from "../../src/ComponentProps.flow";

export default class Input extends React.Component<ComponentProps> {
  render() {
    const { error, ...props } = this.props;
    if (error) {
      props["aria-invalid"] = true;
    }

    return <input {...props} />;
  }
}
