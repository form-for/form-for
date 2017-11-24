// @flow

import * as React from "react";
import PropTypes from "prop-types";

import type { Props as FormProps } from "./Form";

export type SchemaProperty = {
  type?: string,
  [key: string]: any
};

export type Schema = {
  [key: string]: SchemaProperty
};

type Observer = {
  fields: boolean | string | string[],
  fn: Function
};

export type Props = {
  index?: any
} & FormProps;

export default class FieldGroup extends React.Component<Props> {
  values: { [_: any]: any };
  errors: { [_: any]: string } = {};
  observer: { [_: string]: Observer } = {};

  /*
   * Context
   */

  static contextTypes = {
    prefix: PropTypes.string,
    touchOnMount: PropTypes.bool,
    onChange: PropTypes.func
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string,
    getValues: PropTypes.func,
    controlled: PropTypes.bool,
    skipValidation: PropTypes.bool,
    touchOnMount: PropTypes.bool,
    onChange: PropTypes.func,
    onValid: PropTypes.func,
    onInvalid: PropTypes.func,
    mountObserver: PropTypes.func,
    unmountObserver: PropTypes.func
  };

  getChildContext() {
    return {
      object: this.props.for,
      schema: this.getSchema(),
      prefix: this.getPrefix(),
      getValues: this.getValues,
      controlled: this.isControlled(),
      skipValidation: this.props.skipValidation,
      touchOnMount: this.props.touchOnMount,
      onChange: this.handleChange,
      onValid: this.handleValidationSuccess,
      onInvalid: this.handleValidationError,
      mountObserver: this.handleMountObserver,
      unmountObserver: this.handleUnmountObserver
    };
  }

  /*
   * Getters
   */

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

  getValues = (): { [_: any]: any } => {
    return this.values;
  };

  isValid(): boolean {
    return !Object.values(this.errors).length;
  }

  isControlled(): boolean {
    return !!(this.props.onChange || this.context.controlled);
  }

  /*
   * Dispatchers
   */

  dispatchObservers(propertyChanged: string): void {
    Object.keys(this.observer).forEach(name => {
      if (name === propertyChanged) return;

      const observer = this.observer[name];
      const fields = observer.fields;

      if (
        fields === true ||
        fields === propertyChanged ||
        (Array.isArray(fields) && fields.includes(propertyChanged))
      ) {
        observer.fn();
      }
    });
  }

  dispatchChange() {
    if (this.props.onChange) this.props.onChange(this.values, this.errors);
    if (this.context.onChange) this.context.onChange(this.context.name, this.values);
  }

  dispatchValidation() {
    if (this.isValid()) this.dispatchValidationSuccess();
    else this.dispatchValidationError();
  }

  dispatchValidationSuccess() {
    if (this.context.onValid) this.context.onValid(this.context.name);
  }

  dispatchValidationError() {
    if (this.context.onInvalid) this.context.onInvalid(this.context.name, this.errors);
  }

  /*
   * Handlers
   */

  handleChange = (name: string, value: any) => {
    this.values = { ...this.values, [name]: value };
    this.dispatchChange();
    this.dispatchObservers(name);
  };

  handleValidationSuccess = (name: string) => {
    if (this.errors[name]) {
      delete this.errors[name];
      this.dispatchValidationSuccess();
    }
  };

  handleValidationError = (name: string, error: string) => {
    if (this.errors[name] !== error) {
      this.errors[name] = error;
      this.dispatchValidationError();
    }
  };

  handleMountObserver = (name: string, observer: Observer): void => {
    if (name && observer.fields && observer.fn) {
      this.observer[name] = observer;
    }
  };

  handleUnmountObserver = (name: string): void => {
    delete this.observer[name];
  };

  /*
   * Lifecycle
   */

  componentWillMount() {
    this.values = this.props.for;
  }

  componentDidMount() {
    this.dispatchValidation();
    if (this.errors) this.dispatchChange();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.isControlled()) {
      this.values = nextProps.for;
    }
  }

  /*
   * Render
   */

  render(): React.Node {
    return this.props.children;
  }
}
