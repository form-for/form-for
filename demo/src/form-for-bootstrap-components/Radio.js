// @flow

import * as React from "react";
import CoreRadio from "../../../src/components/Radio";
import type { Props as CoreRadioProps } from "../../../src/components/Radio";
import withHumanizedName from "../../../src/withHumanizedName";

type Props = {
  label?: any
} & CoreRadioProps;

class Radio extends React.Component<Props> {
  render() {
    return <CoreRadio {...this.props} />;
  }
}

export default withHumanizedName(Radio, ["label"]);
