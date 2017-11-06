// @flow

import * as React from "react";
import type { ComponentProps } from "./ComponentProps.flow";

export type Props = {
  options: { [key: any]: any },
  map?: Function
} & ComponentProps;

export default class Radio extends React.Component<Props> {
  inputs: (?HTMLInputElement)[] = [];

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
    if (this.props.onMount) {
      this.props.onMount(this.inputs, { value: this.getValue() });
    }
  }

  render() {
    const { error, onMount, options, map, ...props } = { ...this.props };

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

    return this.props.map ? this.props.map(input, value, valueProps) : input;
  }
}
