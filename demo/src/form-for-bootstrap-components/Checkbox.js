// @flow

import * as React from "react";
import CoreCheckbox from "../../../src/components/Checkbox";
import type { Props as CoreCheckboxProps } from "../../../src/components/Checkbox";
import withHumanizedName from "../../../src/withHumanizedName";
import withUniqueId from "../../../src/withUniqueId";
import withHelp from "../../../src/withHelp";
import Help from "./Help";

type Props = {
  label?: any,
  accessibilityLabel?: any,
  help?: string,
  helpId?: string
} & CoreCheckboxProps;

class Checkbox extends React.Component<Props> {
  render() {
    const { error, help, helpId, label, className, accessibilityLabel, ...props } = { ...this.props };

    const inputClasses = ["custom-control-input"];
    if (error) inputClasses.push("is-invalid");

    return (
      <label className={className || "custom-control custom-checkbox"}>
        <CoreCheckbox
          className={inputClasses.join(" ")}
          {...props}
          type="checkbox"
          aria-label={label || accessibilityLabel}
        />
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{label}</span>

        <Help id={helpId} text={help} />
      </label>
    );
  }
}

export default withHelp(withHumanizedName(withUniqueId(Checkbox), ["label", "accessibilityLabel"]));
