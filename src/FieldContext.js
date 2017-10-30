// @flow

import * as React from "react";
import PropTypes from "prop-types";

export type SchemaProperty = {
  type?: string,
  [_: string]: any
};

export type Schema = {
  [_: string]: SchemaProperty
};

export type Props = {
  for: any,
  schema?: Schema,
  index?: any,
  children: React.Node
};

export default class FieldContext extends React.Component<Props> {
  static contextTypes = {
    prefix: PropTypes.string
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string
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
    let prefix = this.context.prefix || '';

    if (typeof this.props.index !== 'undefined') {
      prefix += `[${this.props.index}]`;
    }

    return prefix;
  };

  getChildContext() {
    const object = this.props.for;

    return {
      object,
      schema: this.getSchema(),
      prefix: this.getPrefix()
    };
  }

  render(): React.Node {
    return this.props.children;
  }
}
