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
  prefix?: string,
  children: React.Node
};

export default class FieldContext extends React.Component<Props> {
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

  getChildContext() {
    const object = this.props.for;

    return {
      object,
      schema: this.getSchema(),
      prefix: this.props.prefix
    };
  }

  render(): React.Node {
    return this.props.children;
  }
}
