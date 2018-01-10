// @flow

import * as React from "react";
import type { ComponentProps } from "form-for";
import replaceValueProps from "form-for-component-helpers";

export type Props = {
  checked?: boolean,
  defaultChecked?: boolean,
  ref?: Function
} & ComponentProps;

export default class Checkbox extends React.PureComponent<Props> {
  input: ?HTMLInputElement;

  buildValueProps() {
    if (typeof this.props.checked === "undefined" && typeof this.props.value !== "undefined") {
      return { checked: !!this.props.value };
    }

    if (typeof this.props.defaultChecked === "undefined") {
      this.props.defaultChecked = !!this.props.defaultValue;
    }

    return {};
  }

  handleRef = (el: ?HTMLInputElement) => {
    this.input = el;

    if (this.props.ref) {
      this.props.ref(el);
    }
  };

  handleFocus = (event: any) => {
    this.props.onFocus(event, { value: event.target.checked });
  };

  handleChange = (event: any) => {
    this.props.onChange(event, { value: event.target.checked });
  };

  componentDidMount() {
    this.props.onMount(this.input, { value: (this.input || {}).checked });
  }

  render() {
    const { error, onMount, ...props } = { ...this.props };
    if (error) props["aria-invalid"] = true;

    return <input ref={this.handleRef} {...replaceValueProps(props, "checked", value => !!value)} type="checkbox" />;
  }
}
