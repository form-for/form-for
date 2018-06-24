// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import type { Schema } from './BaseForm';
import cloneObject from './cloneObject';
import prefixer from './prefixer';
import mutateObject from './mutateObject';

export type Props = {
  for: Object,
  schema?: Schema,
  prefix?: string,
  index?: any,
  children: React.Node
};

export default class FieldGroup extends React.Component<Props> {
  errors: Object = {};

  static contextTypes = {
    onFormChange: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    name: PropTypes.string
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string,
    onChange: PropTypes.func
  };

  /*
   * Getters
   */

  getChildContext() {
    return {
      object: this.props.for,
      schema: this.getSchema(),
      prefix: this.getPrefix(),
      onChange: this.handleChange
    };
  }

  getPrefix(): string {
    return prefixer(this.context.prefix, this.context.name, this.props.prefix, this.props.index);
  }

  getSchema(): Schema {
    return this.props.schema || this.props.for.schema || this.throwUndefinedSchema();
  }

  getMutatedObject(name: string, value: any, index: ?any): Object {
    return mutateObject(this.props.for, name, value, index);
  }

  /*
   * Actions
   */

  mutateError(name: string, value: any, index: ?any): void {
    if (this.errors[name] === value) return;

    if (value) {
      if (!index) this.errors[name] = value;
      else this.errors[name][index] = value;
    } else {
      if (!index) delete this.errors[name];
      else delete this.errors[name][index];
    }
  }

  /*
   * Dispatchers
   */

  dispatchChange(newObject: Object) {
    this.context.name ? this.dispatchNestedChange(newObject) : this.dispatchFormChange(newObject);
  }

  dispatchNestedChange(newObject: Object) {
    this.context.onChange(this.context.name, newObject, this.props.index);
  }

  dispatchFormChange(newObject?: Object) {
    this.context.onFormChange(newObject);
  }

  /*
   * Handlers
   */

  onChange(name: string, value: any, index?: any) {
    const newObject = this.getMutatedObject(name, value, index);
    this.dispatchChange(newObject);
  }

  handleChange = (name: string, value: any, index?: any) => {
    this.onChange(name, value, index);
  };

  /*
   * Lifecycle
   */

  render(): React.Node {
    return this.props.children || null;
  }

  /*
   * Errors
   */

  throwUndefinedSchema(): any {
    const constructor = this.props.for.constructor.name;
    throw new Error(`Undefined schema for "${constructor}" instance`);
  }
}
