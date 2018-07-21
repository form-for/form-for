// @flow

import * as React from 'react';

import type { Schema } from '../types';
import {
  FormChangeContext,
  FieldGroupContext,
  FieldGroupValidContext,
  FieldGroupErrorsContext,
  FieldNameContext,
  ValidateContext
} from '../contexts';

import prefixer from '../helpers/prefixer';
import mutateObject from '../helpers/mutateObject';

import Validate from './Validate';

export type Props = {
  for: Object,
  schema?: Schema,
  prefix?: string,
  index?: any,
  children: React.Node
};

type CombinedProps = Props & {
  contextOnFormChange: Function,
  contextFor?: Object,
  contextName?: string,
  contextPrefix?: string,
  contextOnFieldGroupChange: Function
};

export class FieldGroupComponent extends React.Component<CombinedProps> {
  errors: Object = {};

  /*
   * Getters
   */

  getPrefix(): string {
    let { contextPrefix, contextName, prefix, index } = this.props;
    return prefixer(contextPrefix, contextName, prefix, index);
  }

  getSchema(): Schema {
    return this.props.schema || this.props.for.schema || {};
  }

  getMutatedIndexedObject(index: any, value: any): Object {
    return mutateObject(this.props.for, index, value);
  }

  getMutatedObject(name: ?string, value: any, index: ?any): Object {
    if (!name) {
      if (index) return this.getMutatedIndexedObject(index, value);
      return value;
    }

    return mutateObject(this.props.for, name, value, index);
  }

  /*
   * Dispatchers
   */

  dispatchChange(newObject: Object) {
    this.props.contextOnFieldGroupChange ? this.dispatchNestedChange(newObject) : this.dispatchFormChange(newObject);
  }

  dispatchNestedChange(newObject: Object) {
    const { index, contextName, contextOnFieldGroupChange } = this.props;
    contextOnFieldGroupChange(contextName, newObject, index);
  }

  dispatchFormChange(newObject?: Object) {
    this.props.contextOnFormChange(newObject);
  }

  /*
   * Handlers
   */

  onChange(name: ?string, value: any, index?: any) {
    const newObject = this.getMutatedObject(name, value, index);
    this.dispatchChange(newObject);
  }

  /*
   * Bound handlers
   */

  handleChange = (name: string, value: any, index?: any) => {
    this.onChange(name, value, index);
  };

  /*
   * Lifecycle
   */

  render() {
    return (
      <FieldGroupContext.Provider
        value={{
          for: this.props.for,
          schema: this.getSchema(),
          prefix: this.getPrefix(),
          onChange: this.handleChange
        }}
      >
        {this.props.children || null}
      </FieldGroupContext.Provider>
    );
  }
}

export function withFieldGroupContext(Component: React.ComponentType<CombinedProps>) {
  return class extends React.Component<Props> {
    static Context = FieldGroupContext.Consumer;
    static Valid = FieldGroupValidContext.Consumer;
    static Errors = FieldGroupErrorsContext.Consumer;
    static Validate = ValidateContext.Consumer;

    render() {
      const { children, ...otherProps } = this.props;

      return (
        <FormChangeContext.Consumer>
          {onFormChange => (
            <FieldGroupContext.Consumer>
              {fieldGroupContext => (
                <FieldNameContext.Consumer>
                  {fieldName => (
                    <Component
                      contextOnFormChange={onFormChange}
                      contextFor={fieldGroupContext.for}
                      contextSchema={fieldGroupContext.schema}
                      contextPrefix={fieldGroupContext.prefix}
                      contextName={fieldName}
                      contextOnFieldGroupChange={fieldGroupContext.onChange}
                      {...otherProps}
                    >
                      <Validate errorsContext={FieldGroupErrorsContext} validContext={FieldGroupValidContext}>
                        {children}
                      </Validate>
                    </Component>
                  )}
                </FieldNameContext.Consumer>
              )}
            </FieldGroupContext.Consumer>
          )}
        </FormChangeContext.Consumer>
      );
    }
  };
}

export default withFieldGroupContext(FieldGroupComponent);
