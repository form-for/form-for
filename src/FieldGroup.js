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
  dispatcher: Function
};

export type Props = {
  index?: any
} & FormProps;

export default class FieldGroup extends React.Component<Props> {
  _isMounted: boolean;
  values: { [_: any]: any };
  errors: { [_: any]: string } = {};
  observer: { [_: string]: Observer } = {};

  static contextTypes = {
    prefix: PropTypes.string,
    validate: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string,
    getValues: PropTypes.func,
    controlled: PropTypes.bool,
    onChange: PropTypes.func,
    validate: PropTypes.arrayOf(PropTypes.string),
    onValid: PropTypes.func,
    onInvalid: PropTypes.func,
    mountObserver: PropTypes.func,
    unmountObserver: PropTypes.func
  };

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

  getValidate(): string[] {
    if (this.props.validate === false) return [];

    if (this.props.validate === true) return ["focus", "change"];

    if (typeof this.props.validate === "string") {
      return this.props.validate.replace(/\s/g, "").split(",");
    }

    return this.context.validate;
  }

  isValid(): boolean {
    return !Object.values(this.errors).length;
  }

  isControlled(): boolean {
    return !!(this.props.onChange || this.context.controlled);
  }

  /*
   * Dispatchers
   */

  dispatchObservers(propertyChanged: string, type: string): void {
    Object.keys(this.observer).forEach(name => {
      if (name === propertyChanged) return;

      const observer = this.observer[name];
      const fields = observer.fields;

      if (
        fields === true ||
        fields === propertyChanged ||
        (Array.isArray(fields) && fields.includes(propertyChanged))
      ) {
        observer.dispatcher(type, { value: this.values[name] });
      }
    });
  }

  dispatchValidityChange(values: { [_: any]: any }) {
    if (this.props.onValidityChange) {
      this.props.onValidityChange({ values, errors: this.errors });
    }
  }

  dispatchValid(props: { name?: string, value?: any, values?: { [_: any]: any } }) {
    if (this.props.onValid) this.props.onValid(props);
    if (this.context.onValid) this.context.onValid(this.context.name, props.values);
  }

  dispatchInvalid(props: { name?: string, value?: any, error?: string, values?: { [_: any]: any } }) {
    if (this.props.onInvalid) this.props.onInvalid({ errors: this.errors, ...props });
    if (this.context.onInvalid) this.context.onInvalid(this.context.name, props.values, props.error);
  }

  /*
   * Handlers
   */

  handleChange = (name: string, value: any) => {
    this.values = { ...this.values, [name]: value };
    this.dispatchObservers(name, "change");

    if (this.props.onChange) this.props.onChange({ name, value, values: this.values, errors: this.errors });
    if (this.context.onChange) this.context.onChange(this.context.name, this.values);
  };

  handleValid = (name: any, value: any) => {
    const hasError = this.errors[name];
    if (!hasError && this.values[name] === value) return;

    delete this.errors[name];
    if (!this._isMounted) return;

    const values = { ...this.values, [name]: value };
    if (hasError) this.dispatchValidityChange(values);

    if (this.isValid()) this.dispatchValid({ name, value, values });
  };

  handleInvalid = (name: any, value: any, error: string) => {
    const hasSameError = this.errors[name] === error;
    if (hasSameError && this.values[name] === value) return;

    this.errors[name] = error;
    if (!this._isMounted) return;

    const values = { ...this.values, [name]: value };
    if (!hasSameError) this.dispatchValidityChange(values);
    this.dispatchInvalid({ name, value, error, values });
  };

  handleMountObserver = (name: string, observer: Observer): void => {
    if (name && observer.fields && observer.dispatcher) {
      this.observer[name] = observer;
    }
  };

  handleUnmountObserver = (name: string): void => {
    delete this.observer[name];
  };

  /*
   * Lifecycle
   */

  getChildContext() {
    return {
      object: this.props.for,
      schema: this.getSchema(),
      prefix: this.getPrefix(),
      getValues: this.getValues,
      controlled: this.isControlled(),
      onChange: this.handleChange,
      validate: this.getValidate(),
      onValid: this.handleValid,
      onInvalid: this.handleInvalid,
      mountObserver: this.handleMountObserver,
      unmountObserver: this.handleUnmountObserver
    };
  }

  componentWillMount() {
    this.values = this.props.for;
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.isValid()) {
      this.dispatchValid({ values: this.values });
    } else {
      this.dispatchValidityChange(this.values);
      this.dispatchInvalid({ values: this.values });
    }

    if (this.props.onMount) {
      this.props.onMount({ errors: this.errors, values: this.values });
    }
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
