// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export type Props = {
  options: { [key: string]: string },
  map?: Function
} & ComponentProps;

export default class Radio extends React.PureComponent<Props> {
  input: ?HTMLInputElement;

  getInputProps(value: string) {
    const { error, options, map, ...props } = this.props;
    delete props.onMount;
    delete props.touched;

    const checked = value === props.value;
    return { ...props, checked, 'aria-invalid': error, value, type: 'radio' };
  }

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { options } = this.props;
    return Object.keys(options).map(key => this.mapInput(key, options[key]));
  }

  mapInput(value: string, label: any) {
    const inputProps = this.getInputProps(value);
    if (this.props.map) return this.props.map(inputProps, label);

    return (
      <span key={value}>
        <input {...inputProps} /> {label}
      </span>
    );
  }
}
