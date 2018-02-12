// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export type Props = {
  options: { [key: any]: any },
  map?: Function
} & ComponentProps;

export default class Radio extends React.PureComponent<Props> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { options, ...props } = { ...this.props };
    delete props.map;

    return Object.keys(options).map(key => this.renderInput(props, key, options[key]));
  }

  renderInput(props: { [key: any]: any }, key: string, value: any) {
    const { error, ...remainingProps } = props;
    delete props.touched;

    const checked = key === props.value;
    const input = (
      <input key={key} checked={checked} aria-invalid={error} {...remainingProps} value={key} type="radio" />
    );
    return this.mapInput(input, key, value);
  }

  mapInput(input: any, key: string, value: any) {
    if (this.props.map) return this.props.map(input, key, value);
    return (
      <span>
        {input} {key}
      </span>
    );
  }
}
