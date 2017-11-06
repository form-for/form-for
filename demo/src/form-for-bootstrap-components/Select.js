// @flow

import * as React from "react";
import CoreSelect from "../../../src/components/Select";
import type { Props as CoreSelectProps } from "../../../src/components/Select";
import withHumanizedName from "../../../src/withHumanizedName";
import withUniqueId from "../../../src/withUniqueId";
import withHelp from "../../../src/withHelp";
import Label from "./Label";
import Help from "./Help";
import Feedback from "./Feedback";

type Props = {
  id: string,
  label: any,
  help?: string,
  helpId?: string
} & CoreSelectProps;

class SelectInput extends React.Component<Props> {
  render() {
    const { error, help, helpId, label, className, options, ...props } = { ...this.props };

    const selectClasses = ["form-control"];
    if (error) selectClasses.push("is-invalid");

    return (
      <div className={className || "form-group"}>
        <Label for={props.id} text={label} required={props.required} />
        <CoreSelect className={selectClasses.join(" ")} options={options} {...props} />
        <Feedback text={error} />
        <Help id={helpId} text={help} />
      </div>
    );
  }
}

export default withHelp(withHumanizedName(withUniqueId(SelectInput), ["label"]));
