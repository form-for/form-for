import React from "react";

type Props = {
  name: string,
  [_: string]: any
};

export type InputProps = {
  id: string,
  label: string
} & Props;

export default function withInputProps(WrappedComponent) {
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
      let name = this.getSimpleName();
      return (
        name.charAt(0).toUpperCase() +
        name
          .slice(1)
          .split(new RegExp("[_|-]"))
          .join(" ")
      );
    }

    getLabel() {
      const label = this.props.label;
      if (typeof label === "undefined") {
        return this.getHumanizedName();
      }

      return label;
    }

    render() {
      return <WrappedComponent id={this.id} label={this.getLabel()} {...this.props} />;
    }
  };
}
