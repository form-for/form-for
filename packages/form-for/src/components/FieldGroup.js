// @flow

import * as React from 'react';
import type { Schema } from '../types';
import cloneObject from '../helpers/cloneObject';
import prefixer from '../helpers/prefixer';
import mutateObject from '../helpers/mutateObject';
import { FieldGroupContext } from '../contexts';
import { FieldContext } from '../contexts';
import { FormChangeContext } from '../contexts';

export type Props = {
  for: Object,
  schema?: Schema,
  prefix?: string,
  index?: any,
  children: React.Node
};

type CombinedProps = Props & {
  onFormChange: Function,
  onFieldGroupChange: Function,
  name?: string,
  contextPrefix?: string
};

export class FieldGroupComponent extends React.Component<CombinedProps> {
  errors: Object = {};

  // static Valid = FieldGroupValidContext.Consumer;
  // static Errors = FieldGroupErrorsContext.Consumer;

  /*
   * Getters
   */

  getPrefix(): string {
    return prefixer(this.props.contextPrefix, this.props.name, this.props.prefix, this.props.index);
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
    this.props.name ? this.dispatchNestedChange(newObject) : this.dispatchFormChange(newObject);
  }

  dispatchNestedChange(newObject: Object) {
    this.props.onFieldGroupChange(this.props.name, newObject, this.props.index);
  }

  dispatchFormChange(newObject?: Object) {
    this.props.onFormChange(newObject);
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

  render() {
    const { for: object, children } = this.props;

    return (
      <FieldGroupContext.Provider
        value={{
          object,
          schema: this.getSchema(),
          contextPrefix: this.getPrefix(),
          onFieldGroupChange: this.handleChange
        }}
      >
        {children || null}
      </FieldGroupContext.Provider>
    );
  }

  /*
   * Errors
   */

  throwUndefinedSchema(): any {
    const constructor = this.props.for.constructor.name;
    throw new Error(`Undefined schema for "${constructor}" instance`);
  }
}

export function withFieldGroupContext(Component: React.ComponentType<CombinedProps>) {
  return ({ children, ...otherProps }: Props) => (
    <FormChangeContext.Consumer>
      {onFormChange => (
        <FieldGroupContext.Consumer>
          {({ onFieldGroupChange }) => (
            <FieldContext.Consumer>
              {fieldProps => (
                <Component
                  {...fieldProps}
                  {...otherProps}
                  onFormChange={onFormChange}
                  onFieldGroupChange={onFieldGroupChange}
                >
                  {children}
                </Component>
              )}
            </FieldContext.Consumer>
          )}
        </FieldGroupContext.Consumer>
      )}
    </FormChangeContext.Consumer>
  );
}

export default withFieldGroupContext(FieldGroupComponent);
