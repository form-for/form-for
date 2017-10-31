// @flow

import * as React from "react";
import PropTypes from "prop-types";

import type { Props as FormProps } from './Form';

export type SchemaProperty = {
  type?: string
};

export type Schema = {
  [_: string]: SchemaProperty
};

export type Props = {
  index?: any,
} & FormProps;

export default class FieldGroup extends React.Component<Props> {
  static contextTypes = {
    prefix: PropTypes.string,
    onChange: PropTypes.func
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string,
    onChange: PropTypes.func
  };

  getSchema(): Schema {
    const object = this.props.for;
    const schema = this.props.schema || object.schema;

    if (!schema) {
      throw new Error("Undefined schema for " + object.constructor.name + "instance");
    }

    return schema;
  }

  getPrefix(): string {
    let prefix = this.props.prefix || this.context.prefix || "";

    if (typeof this.props.index !== "undefined") {
      prefix += `[${this.props.index}]`;
    }

    return prefix;
  }

  handleChange = (mutator: Function, name: string, value: string) => {
    if (this.props.onChange) {
      this.props.onChange(mutator, name, value);
    }
  };

  getChildContext() {
    const context: any = {
      object: this.props.for,
      schema: this.getSchema(),
      prefix: this.getPrefix()
    };

    if (this.context.onChange || this.props.onChange) {
      context.onChange = this.context.onChange || this.handleChange;
    }

    return context;
  }

  render(): React.Node {
    return this.props.children;
  }
}
