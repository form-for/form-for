// @flow

import * as React from "react";

import PropTypes from "prop-types";
import type { SchemaProperty } from "./FieldGroup";

export type Props = {
  name: string,
  type?: string,
  onChange?: Function
};

export default class Field extends React.Component<Props> {
  static contextTypes = {
    object: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    onChange: PropTypes.func
  };

  static childContextTypes = {
    prefix: PropTypes.string
  };

  static inputsBindings: { [_: string]: React.ComponentType<*> } = {};

  static bindInput(type: string, component: React.ComponentType<*>): void {
    this.inputsBindings[type] = component;
  }

  getSchemaProperty(): SchemaProperty {
    const property = this.context.schema[this.props.name];
    if (!property) {
      throw new Error(`Undefined property ${this.props.name} in form for ${this.context.object.constructor.name} instance`);
    }

    return property;
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

  getValueProp() {
    if (typeof this.props.value === "undefined") {
      if (this.context.onChange) {
        return { value: this.getObjectValue() || "" };
      }

      if (!this.props.defaultValue) {
        return { defaultValue: this.getObjectValue() };
      }
    }

    return {};
  }

  getOnChangeProp() {
    if (!this.context.onChange) return {};

    return {
      onChange: (event: Event, value?: any) => {
        if (typeof value === 'undefined' && event.target) {
          // $FlowFixMe
          value = event.target.value;
        }
        
        this.context.onChange(
          () => {
            this.context.object[this.props.name] = value;
            return this.context.object;
          },
          this.getPrefixedName(),
          value
        );

        if (this.props.onChange) {
          this.props.onChange(event);
        }
      }
    };
  }

  getInputProps() {
    return {
      ...this.getSchemaProperty(),
      ...this.props,
      name: this.getPrefixedName(),
      ...this.getValueProp(),
      ...this.getOnChangeProp()
    };
  }

  render() {
    const input = this.getInput();
    if (!input) throw new Error(`Undefined input for field ${this.props.name} with type ${this.getType()}`);

    return React.createElement(input, this.getInputProps());
  }
}
