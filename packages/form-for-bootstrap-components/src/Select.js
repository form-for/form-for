// @flow

import * as React from "react";
import { Select as CoreSelect } from "form-for-components";
import type { SelectProps } from "form-for-components";
import { help, humanized, uniqueId } from "form-for-component-helpers";
import humanizeOptions from "./humanizeOptions";
import Label from "./Label";
import Help from "./Help";
import Feedback from "./Feedback";

export type Props = {
  label?: any,
  help?: any
} & SelectProps;

export default class Select extends React.Component<Props> {
  render() {
    const id = uniqueId(this);
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { label, className, options, ...props } = { ...this.props };
    delete props.help;

    const selectClasses = ["form-control"];
    if (props.error) selectClasses.push("is-invalid");

    return (
      <div className={className || "form-group"}>
        <Label for={id} text={label} defaultText={humanizedName} required={props.required} />

        <CoreSelect
          id={id}
          className={selectClasses.join(" ")}
          aria-describedby={helpProps.id}
          options={humanizeOptions(options)}
          {...(props: SelectProps)}
        />

        <Help id={helpProps.id} text={helpProps.text} />
        <Feedback text={props.error} />
      </div>
    );
  }
}
