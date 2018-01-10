// @flow

import * as React from "react";
import type { ComponentProps } from "form-for";

export type Props = {
  checked?: boolean,
  defaultChecked?: boolean,
  options: { [key: any]: any },
  map?: Function,
  ref?: Function
} & ComponentProps;

export default class Radio extends React.PureComponent<Props> {
  inputs: ?(HTMLInputElement[]) = [];

  getValue() {
    if (typeof this.props.checked !== "undefined") return this.props.checked;
    if (typeof this.props.defaultChecked !== "undefined") return this.props.defaultChecked;
    if (typeof this.props.value !== "undefined") return this.props.value;

    return this.props.defaultValue;
  }

  buildValuePropsFor(value: string) {
    if (typeof this.props.value !== "undefined") {
      return { checked: value === this.props.value };
    }

    return { defaultChecked: value === this.props.defaultValue };
  }

  handleRef = (el: ?HTMLInputElement) => {
    this.inputs.push(el);

    if (this.props.ref && this.inputs.length === Object.keys(this.props.options).length) {
      this.props.ref(el);
    }
  };

  componentDidMount() {
    this.props.onMount(this.inputs, { value: this.getValue() });
  }

  render() {
    const { error, onMount, options, map, ...props } = { ...this.props };
    if (error) props["aria-invalid"] = true;

    return Object.keys(options).map(value => this.renderInput(props, value, options[value]));
  }

  renderInput(props: { [key: any]: any }, value: string, valueProps: any) {
    const input = (
      <input
        key={value}
        ref={this.handleRef}
        {...this.buildValuePropsFor(value)}
        {...props}
        value={value}
        type="radio"
      />
    );

    return this.mapInput(input, value, valueProps);
  }

  mapInput(input: any, value: string, valueProps: any) {
    if (this.props.map) return this.props.map(input, value, valueProps);

    return (
      <span>
        {input}
        {value}
      </span>
    );
  }
}
