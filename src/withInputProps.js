// @flow

import * as React from "react";
import { humanize } from "./stringHelpers";

type Props = {
  name: string,
  [_: string]: any
};

export type InputProps = {
  id: string,
  label?: string,
  placeholder?: string
} & Props;

export default function withInputProps(WrappedComponent: React.ComponentType<*>) {
  return class extends React.Component<Props> {
    id: string;
    static id: number = 0;

    constructor(props: Props) {
      super(props);
      this.id = this.generateId();
    }

    generateId() {
      return this.props.name + "#" + this.constructor.id++;
    }

    getSimpleName() {
      const name = this.props.name;

      const lastIndexOfBracket = name.lastIndexOf("[");
      if (lastIndexOfBracket === -1) {
        return name;
      }

      return name.substring(lastIndexOfBracket + 1, name.length - 1);
    }

    getHumanizedName() {
      return humanize(this.getSimpleName());
    }

    render() {
      const humanizedName = this.getHumanizedName();

      return <WrappedComponent id={this.id} label={humanizedName} placeholder={humanizedName} {...this.props} />;
    }
  };
}
