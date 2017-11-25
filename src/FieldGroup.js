// @flow

import * as React from "react";
import PropTypes from "prop-types";

import type { Props as FormProps } from "./Form";
import { clone } from "./helpers";

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
  data: { [_: any]: any };
  errors: { [_: any]: string } = {};
  observer: { [_: string]: Observer } = {};

  /*
   * Context
   */

  static contextTypes = {
    name: PropTypes.string,
    prefix: PropTypes.string,
    getData: PropTypes.func,
    touchOnMount: PropTypes.bool,
    onChange: PropTypes.func
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    prefix: PropTypes.string,
    getData: PropTypes.func,
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
      getData: this.getData,
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

  getData = (): { [_: any]: any } => {
    return this.data;
  };

  getMutatorFor(name: ?string, value: ?any): Function {
    const fn = () => {
      if (name) {
        const index = this.props.index;
        if (this.props.index) {
          this.props.for[name][index] = value;
        } else {
          this.props.for[name] = value;
        }
      }
    };

    fn.propertyName = name;
    fn.propertyValue = value;

    return fn;
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

  dispatchChange(name?: string, value?: any) {
    const onChangeProp = this.props.onChange;
    if (onChangeProp) {
      const mutator = this.getMutatorFor(name, value);
      onChangeProp(this.data, this.errors, mutator);
    }

    if (this.context.onChange) {
      const index = this.props.index;
      if (typeof index === "undefined") {
        throw `Nested field group without index for ${this.data.toString()}.`;
      }

      const data = clone(this.context.getData());
      data[index] = this.data;

      this.context.onChange(this.context.name, data);
    }
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
    this.data = clone(this.data);
    this.data[name] = value;

    this.dispatchChange(name, value);
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
    this.data = this.props.for;
  }

  componentDidMount() {
    this.dispatchValidation();
    if (this.errors) this.dispatchChange();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.isControlled()) {
      this.data = nextProps.for;
    }
  }

  /*
   * Render
   */

  render(): React.Node {
    return this.props.children;
  }
}
