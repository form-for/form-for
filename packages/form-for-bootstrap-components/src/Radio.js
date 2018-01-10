// @flow

import * as React from "react";
import { Radio as CoreRadio } from "form-for-components";
import type { RadioProps } from "form-for-components";
import { help, humanized } from "form-for-component-helpers";
import humanizeOptions from "./humanizeOptions";
import Label from "./Label";
import Help from "./Help";
import Feedback from "./Feedback";

export type Props = {
  label?: any,
  help?: any
} & RadioProps;

export default class Radio extends React.Component<Props> {
  render() {
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { label, className, options, ...props } = { ...this.props };
    delete props.help;

    const inputClasses = ["custom-control-input"];
    if (props.error) inputClasses.push("is-invalid");

    return (
      <div className={className || "form-group"}>
        <header>
          <Label text={label} defaultText={humanizedName} required={props.required} />
        </header>

        <CoreRadio
          className={inputClasses.join(" ")}
          map={this.renderRadio.bind(this)}
          options={humanizeOptions(options)}
          // $FlowFixMe
          {...(props: RadioProps)}
        />

        <Help id={helpProps.id} text={helpProps.text} />

        {/* Workaround for Bootstrap 4 issue - https://github.com/twbs/bootstrap/issues/24624 */}
        <div aria-hidden="true" className="form-control is-invalid" style={{ display: "none" }} />
        <Feedback text={props.error} />
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
