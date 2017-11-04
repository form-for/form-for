// @flow

import * as React from "react";
import CoreSelect from "../../../src/components/Select";
import type { Props as CoreSelectProps } from "../../../src/components/Select";
import withHumanizedName from "../../../src/withHumanizedName";
import withUniqueId from "../../../src/withUniqueId";
import Label from "./Label";
import Help from "./Help";
import Feedback from "./Feedback";

type Props = {
  label: any
} & CoreSelectProps;

class SelectInput extends React.Component<Props> {
  render() {
    const { error, help, label, classNames, options, ...props } = { ...this.props };

    const selectClasses = classNames ? [classNames] : ["form-control"];
    if (error) selectClasses.push("is-invalid");

    const helpId = this.props.id + "-help";
    if (help) {
      props["aria-describedby"] = helpId;
    }

    return (
      <div className="form-group">
        <Label for={this.props.id} text={label} required={this.props.required} />
        <CoreSelect className={selectClasses.join(" ")} options={options} {...props} />
        <Feedback text={error} />
        <Help id={helpId} text={help} />
      </div>
    );
  }
}

export default withHumanizedName(withUniqueId(SelectInput), ["label"]);
