// @flow

import * as React from "react";
import { Input as CoreInput } from "form-for-components";
import type { InputProps } from "form-for-components";
import { help, humanized, uniqueId } from "form-for-component-helpers";
import Label from "./Label";
import Help from "./Help";
import Feedback from "./Feedback";

export type Props = {
  label?: any,
  help?: any
} & InputProps;

export default class Input extends React.Component<Props> {
  render() {
    const id = uniqueId(this);
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { label, className, ...props } = { ...this.props };
    delete props.help;

    const inputClasses = ["form-control"];
    if (props.error) inputClasses.push("is-invalid");

    return (
      <div className={className || "form-group"}>
        <Label for={id} text={label} defaultText={humanizedName} required={props.required} />

        <CoreInput
          id={id}
          className={inputClasses.join(" ")}
          aria-describedby={helpProps.id}
          // $FlowFixMe
          {...(props: InputProps)}
        />

        <Help id={helpProps.id} text={helpProps.text} />
        <Feedback text={props.error} />
      </div>
    );
  }
}
