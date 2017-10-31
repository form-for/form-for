// @flow

import * as React from "react";

import PropTypes from "prop-types";
import type { SchemaProperty } from "./FieldGroup";

type Props = {
  name: string,
  type?: string
};

export default class Field extends React.Component<Props> {
  static contextTypes = {
    object: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    prefix: PropTypes.string
  };

  static childContextTypes = {
    prefix: PropTypes.string
  };

  static inputsBindings: { [_: string]: React.ComponentType<*> } = {};

  static bindInput(type: string, component: React.ComponentType<*>): void {
    this.inputsBindings[type] = component;
  }

  getSchemaProperty(): SchemaProperty {
    return this.context.schema[this.props.name] || {};
  }

  getType(): string {
    return this.props.type || this.getSchemaProperty().type || "text";
  }

  getInput(): React.ComponentType<*> {
    return this.constructor.inputsBindings[this.getType()];
  }

  getObjectValue(): any {
    return this.context.object[this.props.name];
  }

  getPrefixedName() {
    if (this.context.prefix) {
      return `${this.context.prefix}[${this.props.name}]`;
    }

    return this.props.name;
  }

  getChildContext() {
    return {
      prefix: this.getPrefixedName()
    };
  }

  render() {
    const input = this.getInput();
    if (!input) throw new Error(`Undefined input for field ${this.props.name} with type ${this.getType()}`);

    const props = {
      ...this.getSchemaProperty(),
      ...this.props,
      name: this.getPrefixedName()
    };

    if (!props.defaultValue && !props.value) {
      props.defaultValue = this.getObjectValue();
    }

    return React.createElement(input, props);
  }
}
