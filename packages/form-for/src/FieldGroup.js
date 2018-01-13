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
  fn: Function,
  selfFn: Function
};

export type Props = {
  index?: any
} & FormProps;

const DEFAULT_MUTATION_WRAPPER = (mutator, name, value) => mutator();

export default class FieldGroup extends React.PureComponent<Props> {
  data: { [_: any]: any };
  observer: { [_: string]: Observer } = {};

  /*
   * Context
   */

  static contextTypes = {
    immutable: PropTypes.bool,
    mutationWrapper: PropTypes.func,
    name: PropTypes.string,
    prefix: PropTypes.string,
    getData: PropTypes.func,
    controlled: PropTypes.bool,
    skipValidation: PropTypes.bool,
    touchOnMount: PropTypes.bool,
    onChange: PropTypes.func
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    immutable: PropTypes.bool,
    mutationWrapper: PropTypes.func,
    prefix: PropTypes.string,
    onChange: PropTypes.func,
    skipValidation: PropTypes.bool,
    touchOnMount: PropTypes.bool,
    getData: PropTypes.func,
    controlled: PropTypes.bool,
    autoRendering: PropTypes.bool,
    mountObserver: PropTypes.func,
    unmountObserver: PropTypes.func
  };

  getChildContext() {
    return {
      object: this.props.for,
      schema: this.getSchema(),
      immutable: this.isImmutable(),
      mutationWrapper: this.getMutationWrapper(),
      prefix: this.getPrefix(),
      onChange: this.handleChange,
      controlled: this.isControlled(),
      autoRendering: this.hasAutoRendering(),
      skipValidation: this.hasSkipValidation(),
      touchOnMount: this.hasTouchOnMount(),
      getData: this.getData,
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
      throw "Undefined schema for " + object.constructor.name + "instance";
    }

    return schema;
  }

  isImmutable(): boolean {
    if (typeof this.props.immutable !== "undefined") return this.props.immutable;
    return this.context.immutable;
  }

  getMutationWrapper(): Function {
    return this.props.mutationWrapper || this.context.mutationWrapper || DEFAULT_MUTATION_WRAPPER;
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

  isControlled(): boolean {
    if (this.props.uncontrolled) return false;
    return !!(this.props.onChange || this.context.controlled);
  }

  hasAutoRendering(): boolean {
    return !!(this.props.autoRendering || this.context.autoRendering);
  }

  hasSkipValidation(): boolean {
    return !!(this.props.skipValidation || this.context.skipValidation);
  }

  hasTouchOnMount(): boolean {
    return !!(this.props.touchOnMount || this.context.touchOnMount);
  }

  requestIndex(): any {
    const index = this.props.index;
    if (typeof index === "undefined") {
      throw `Nested field group without index for ${this.data.toString()}.`;
    }

    return index;
  }

  /*
   * Dispatchers
   */

  dispatchObservers(propertyChanged: string): void {
    Object.keys(this.observer).forEach(name => {
      const observer = this.observer[name];
      const fields = observer.fields;

      if (name === propertyChanged) {
        observer.selfFn();
      } else if (
        fields === true ||
        fields === propertyChanged ||
        (Array.isArray(fields) && fields.includes(propertyChanged))
      ) {
        observer.fn(propertyChanged);
      }
    });
  }

  dispatchChange() {
    if (this.props.onChange) this.props.onChange(this.data);
    if (this.context.onChange) this.dispatchParentChange();
  }

  dispatchParentChange() {
    let data = this.context.getData()[this.context.name] || {};
    if (this.isImmutable()) {
      data = clone(data);
      data[this.requestIndex()] = this.data;
    }

    this.context.onChange(this.context.name, data);
  }

  /*
   * Handlers
   */

  handleChange = (name: string, value: any) => {
    if (this.isImmutable()) this.data = clone(this.data);

    const mutator = () => (this.data[name] = value);
    this.getMutationWrapper()(mutator, name, value);

    this.dispatchChange();
    this.dispatchObservers(name);
  };

  handleMountObserver = (name: string, observer: Observer): void => {
    this.observer[name] = observer;
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
