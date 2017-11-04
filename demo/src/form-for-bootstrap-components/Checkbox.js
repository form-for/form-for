// @flow

import * as React from "react";
import CoreCheckbox from "../../../src/components/Checkbox";
import type { Props as CoreCheckboxProps } from "../../../src/components/Checkbox";
import withHumanizedName from "../../../src/withHumanizedName";

type Props = {
  label?: any,
  accessibilityLabel?: any
} & CoreCheckboxProps;

class Checkbox extends React.Component<Props> {
  render() {
    const { error, label, className, accessibilityLabel, ...props } = { ...this.props };

    const inputClasses = className ? [className] : ["custom-control-input"];
    if (error) inputClasses.push("is-invalid");

    return (
      <label className="custom-control custom-checkbox">
        <CoreCheckbox
          className={inputClasses.join(" ")}
          {...props}
          type="checkbox"
          aria-label={label || accessibilityLabel}
        />
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{this.props.label}</span>
      </label>
    );
  }
}

export default withHumanizedName(Checkbox, ["label", "accessibilityLabel"]);
