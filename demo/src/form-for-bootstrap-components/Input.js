// @flow

import * as React from "react";
import type { Props as CoreInputProps } from "../../../src/components/Input";
import CoreInput from "../../../src/components/Input";
import withHumanizedName from "../../../src/withHumanizedName";
import withUniqueId from "../../../src/withUniqueId";
import Label from "./Label";
import Feedback from "./Feedback";
import Help from "./Help";

export type Props = {
  label: any
} & CoreInputProps;

class Input extends React.Component<Props> {
  render() {
    const { error, help, label, className, ...props } = { ...this.props };

    const inputClasses = className ? [className] : ["form-control"];
    if (error) inputClasses.push("is-invalid");

    const helpId = this.props.id + "-help";
    if (help) {
      props["aria-describedby"] = helpId;
    }

    return (
      <div className="form-group">
        <Label for={this.props.id} text={label} required={this.props.required} />
        <CoreInput className={inputClasses.join(" ")} {...props} />
        <Feedback text={error} />
        <Help id={helpId} text={help} />
      </div>
    );
  }
}

export default withHumanizedName(withUniqueId(Input), ["label", "placeholder"]);
