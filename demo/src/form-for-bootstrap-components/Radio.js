// @flow

import * as React from "react";
import type { Props as CoreRadioProps } from "../../../src/components/Radio";
import CoreRadio from "../../../src/components/Radio";
import withUniqueId from "../../../src/withUniqueId";
import withHumanizedName from "../../../src/withHumanizedName";
import withHelp from "../../../src/withHelp";
import Label from "./Label";
import Help from "./Help";

type Props = {
  label: string,
  help?: string,
  helpId?: string
} & CoreRadioProps;

class Radio extends React.Component<Props> {
  render() {
    const { error, help, helpId, label, className, options, ...props } = { ...this.props };

    const inputClasses = ["custom-control-input"];
    if (error) inputClasses.push("is-invalid");
    console.log(error);

    return (
      <div className={className || "form-group"}>
        <header>
          <Label for={props.id} text={label} required={props.required} />
        </header>

        <CoreRadio options={options} {...props} className={inputClasses.join(" ")} map={this.renderRadio.bind(this)} />
        <Help id={helpId} text={help} />
      </div>
    );
  }

  renderRadio(input: React.Node, value: string, valueProps: any) {
    return (
      <label key={value} className="custom-control custom-radio">
        {input}
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{valueProps}</span>
      </label>
    );
  }
}

export default withHelp(withHumanizedName(withUniqueId(Radio), ["label"]));
