// @flow

import * as React from "react";
import type { ComponentProps } from "./ComponentProps.flow";

export type Props = {} & ComponentProps;

export default class Checkbox extends React.Component<Props> {
  input: ?HTMLInputElement;

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

  handleBlur = (event: any) => {
    this.props.onBlur(event, { value: event.target.checked });
  };

  buildEventHandlers() {
    const onFocus = this.props.onFocus ? this.handleFocus : undefined;
    const onChange = this.props.onChange ? this.handleChange : undefined;
    const onBlur = this.props.onBlur ? this.handleBlur : undefined;

    return { onFocus, onChange, onBlur };
  }

  componentDidMount() {
    this.props.onMount(this.input, { value: (this.input || {}).checked });
  }

  render() {
    const { defaultValue, value, onMount, ...props } = { ...this.props };

    if (typeof props.checked === "undefined" && typeof value !== "undefined") {
      props.checked = !!value;
    } else if (typeof props.defaultChecked === "undefined") {
      props.defaultChecked = !!defaultValue;
    }

    return <input ref={this.handleRef} {...props} {...this.buildEventHandlers()} type="checkbox" />;
  }
}
