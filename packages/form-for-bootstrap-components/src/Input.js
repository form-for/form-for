// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';
import { Input as BaseInput } from 'form-for-components';
import { help, humanized, uniqueId } from 'form-for-component-helpers';
import Label from './Label';
import Help from './Help';
import Feedback from './Feedback';

export type Props = ComponentProps & {
  className?: string,
  placeholder?: string,
  required?: boolean,
  label?: any,
  help?: any,
  component?: React.ComponentType<*>
};

export default class Input extends React.PureComponent<Props> {
  render() {
    const id = uniqueId(this);
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { label, className, placeholder, component, ...props } = { ...this.props };
    delete props.help;

    const inputClasses = ['form-control'];
    if (props.touched && props.error) inputClasses.push('is-invalid');

    const InputComponent = component || BaseInput;

    return (
      <div className={className || 'form-group'}>
        <Label for={id} text={label} defaultText={humanizedName} required={props.required} />

        <InputComponent
          id={id}
          className={inputClasses.join(' ')}
          aria-describedby={helpProps.id}
          placeholder={placeholder || humanizedName}
          {...props}
        />

        <Help id={helpProps.id} text={helpProps.text} />
        <Feedback text={props.error} />
      </div>
    );
  }
}
