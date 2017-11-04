// @flow

import * as React from "react";

export default function withInputProps(WrappedComponent: React.ComponentType<*>) {
  return class extends React.Component<*> {
    id: string;
    static id: number = 0;

    constructor(props: any) {
      super(props);
      this.id = this.generateId();
    }

    generateId() {
      return this.props.name + "#" + this.constructor.id++;
    }

    render() {
      return <WrappedComponent id={this.id} {...this.props} />;
    }
  };
}
