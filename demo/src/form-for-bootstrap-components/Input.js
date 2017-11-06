// @flow

import * as React from "react";
import type { Props as CoreInputProps } from "../../../src/components/Input";
import CoreInput from "../../../src/components/Input";
import withHumanizedName from "../../../src/withHumanizedName";
import withUniqueId from "../../../src/withUniqueId";
import withHelp from "../../../src/withHelp";
import Label from "./Label";
import Feedback from "./Feedback";
import Help from "./Help";

export type Props = {
  id: string,
  label: any,
  help?: string,
  helpId?: string
} & CoreInputProps;

class Input extends React.Component<Props> {
  render() {
    const { error, help, helpId, label, className, ...props } = { ...this.props };

    const inputClasses = ["form-control"];
    if (error) inputClasses.push("is-invalid");

    return (
      <div className={className || "form-group"}>
        <Label for={props.id} text={label} required={props.required} />
        <CoreInput className={inputClasses.join(" ")} {...props} />
        <Feedback text={error} />
        <Help id={helpId} text={help} />
      </div>
    );
  }
}

export default withHelp(withHumanizedName(withUniqueId(Input), ["label", "placeholder"]));
