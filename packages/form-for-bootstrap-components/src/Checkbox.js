// @flow

import * as React from "react";
import { Checkbox as CoreCheckbox } from "form-for-components";
import type { CheckboxProps } from "form-for-components";
import { help, humanized, uniqueId } from "form-for-component-helpers";
import Help from "./Help";

export type Props = {
  label?: any,
  help?: any
} & CheckboxProps;

export default class Checkbox extends React.Component<Props> {
  render() {
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { className, label, ...props } = { ...this.props };
    delete props.help;

    const inputClasses = ["custom-control-input"];
    if (props.error) inputClasses.push("is-invalid");

    return (
      <label className={className || "custom-control custom-checkbox"}>
        <CoreCheckbox
          id={uniqueId(this)}
          className={inputClasses.join(" ")}
          aria-label={label || humanizedName}
          aria-describedby={helpProps.id}
          {...(props: CheckboxProps)}
        />
        <span className="custom-control-indicator" />
        {label !== false && <span className="custom-control-description">{label || humanizedName}</span>}

        <Help id={helpProps.id} text={helpProps.text} />
      </label>
    );
  }
}
