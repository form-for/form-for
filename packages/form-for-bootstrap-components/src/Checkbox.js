// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';
import { Checkbox as BaseCheckbox } from 'form-for-components';
import { help, humanized, uniqueId } from 'form-for-component-helpers';
import Help from './Help';

export type Props = ComponentProps & {
  label?: any,
  help?: any
};

export default class Checkbox extends React.PureComponent<Props> {
  render() {
    const id = uniqueId(this);
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { className, label, ...props } = { ...this.props };
    delete props.help;

    const inputClasses = ['custom-control-input'];
    if (props.touched && props.error) inputClasses.push('is-invalid');

    return (
      <div className={className || 'custom-control custom-checkbox'}>
        <BaseCheckbox
          id={id}
          className={inputClasses.join(' ')}
          aria-label={label || humanizedName}
          aria-describedby={helpProps.id}
          {...props}
        />

        <label className="custom-control-label" htmlFor={id}>
          {label !== false && (label || humanizedName)}
        </label>

        <Help id={helpProps.id} text={helpProps.text} />
      </div>
    );
  }
}
