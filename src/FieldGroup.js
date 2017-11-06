// @flow

import * as React from "react";
import PropTypes from "prop-types";

import type { Props as FormProps } from "./Form";

export type SchemaProperty = {
  type?: string,
  [_: string]: any
};

export type Schema = {
  [_: string]: SchemaProperty
};

export type Props = {
  index?: any
} & FormProps;

export default class FieldGroup extends React.Component<Props> {
  static contextTypes = {
    prefix: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.arrayOf(PropTypes.string)
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string,
    mutable: PropTypes.bool,
    validate: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
  };

  getSchema(): Schema {
    const object = this.props.for;
    const schema = this.props.schema || object.schema || {};

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

  getValidate() {
    if (this.props.validate === false) return [];

    if (this.props.validate === true) return ["focus", "change", "blur"];

    if (typeof this.props.validate === "string") {
      return this.props.validate.replace(/\s/g, "").split(",");
    }

    return this.props.validate || this.context.validate;
  }

  handleChange = (mutator: Function, name: string, value: string) => {
    if (this.props.onChange) {
      this.props.onChange(mutator, name, value);
    }
  };

  getChildContext() {
    return {
      object: this.props.for,
      schema: this.getSchema(),
      prefix: this.getPrefix(),
      validate: this.getValidate(),
      onChange: this.props.onChange ? this.handleChange : this.context.onChange
    };
  }

  render(): React.Node {
    return this.props.children;
  }
}
