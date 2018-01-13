// @flow

import * as React from "react";

import PropTypes from "prop-types";
import type { SchemaProperty } from "./FieldGroup";

export type ComponentProps = {
  type: string,
  name: string,
  error?: any,
  touched: boolean,
  onMount: Function,
  onFocus: Function,
  onChange: Function,
  value?: any,
  defaultValue?: any
};

export type Props = {
  name: string,
  type?: string,
  onFocus?: Function,
  onChange?: Function,
  validator?: Function,
  error?: any,
  observe?: boolean | string | string[]
};

type State = {
  error: ?any,
  touched: boolean
};

export default class Field extends React.PureComponent<Props, State> {
  static autoBind: boolean = false;
  static pendingAutoBindComponents: { [name: string]: React.ComponentType<*> } = {};

  target: ?any;
  value: ?any;
  error: ?any;

  state = { error: undefined, touched: false };

  /*
   * Component binding
   */

  static componentBindings: { [_: string]: React.ComponentType<*> } = {};

  static registerComponentExistance(type: string, component: React.ComponentType<*>): void {
    if (this.autoBind) Field.bindComponent(type, component);
    else Field.pendingAutoBindComponents[type] = component;
  }

  static bindComponent(type: string, component: React.ComponentType<*>): void {
    Field.componentBindings[type] = component;
  }

  static enableAutoBind(): void {
    Field.autoBind = true;
    Field.bindPendingAutoBindComponents();
  }

  static bindPendingAutoBindComponents(): void {
    Object.keys(Field.pendingAutoBindComponents).forEach(type => {
      Field.bindComponent(type, Field.pendingAutoBindComponents[type]);
    });

    Field.pendingAutoBindComponents = {};
  }

  /*
   * Context
   */

  static contextTypes = {
    object: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    prefix: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    skipValidation: PropTypes.bool,
    touchOnMount: PropTypes.bool,
    getData: PropTypes.func.isRequired,
    controlled: PropTypes.bool.isRequired,
    autoRendering: PropTypes.bool.isRequired,
    mountObserver: PropTypes.func.isRequired,
    unmountObserver: PropTypes.func.isRequired
  };

  static childContextTypes = {
    prefix: PropTypes.string,
    name: PropTypes.string
  };

  getChildContext() {
    return {
      prefix: this.getPrefixedName(),
      name: this.props.name
    };
  }

  /*
   * Getters
   */

  getContextObjectValue() {
    return this.context.object[this.props.name];
  }

  getData = (): any => {
    return this.context.getData()[this.props.name];
  };

  getSchemaProperty(): SchemaProperty {
    const property = this.context.schema[this.props.name];
    if (!property) {
      if (this.props.type) {
        return { type: this.props.type };
      }

      throw new Error(
        `Undefined property "${this.props.name}" in schema or inline type for
        "${this.context.object.constructor.name}" instance`
      );
    }

    return property;
  }

  getType(): string {
    return this.props.type || this.getSchemaProperty().type || "text";
  }

  getComponent(): React.ComponentType<*> {
    const type = this.getType();
    const component = Field.componentBindings[type];

    if (!component) {
      throw new Error(`Unbound component field type ${type} for ${this.props.name}`);
    }

    return component;
  }

  getPrefixedName() {
    if (this.context.prefix) {
      const suffix = this.props.name ? `[${this.props.name}]` : "";
      return `${this.context.prefix}${suffix}`;
    }

    return this.props.name;
  }

  getValidatorFunction(): ?Function {
    if (this.props.validator) return this.props.validator;

    const validator = this.getSchemaProperty().validator;

    if (typeof validator === "string") {
      return this.context.object[validator].bind(validator);
    }

    return validator;
  }

  /*
   * Setters
   */

  setBrowserCustomValidity(message: ?string): void {
    if (!this.target) return;

    const targets = Array.isArray(this.target) ? this.target : [this.target];
    targets.forEach(element => {
      if (element.setCustomValidity) element.setCustomValidity(message);
    });
  }

  clearBrowserCustomValidity() {
    this.setBrowserCustomValidity("");
  }

  /*
   * Actions
   */

  validate = () => {
    this.validateTarget(this.target);
  };

  validateTarget(target: any): void {
    if (this.context.skipValidation) return;
    this.clearBrowserCustomValidity();

    target = target || {};
    const value = this.value || target.value;

    let error;
    if (this.props.error) {
      error = this.props.error;
    } else {
      const validatorResponse = this.validator(value);
      error = validatorResponse || this.error || target.validationMessage;
    }

    this.setBrowserCustomValidity(error);
    this.setState({ error: error });
  }

  validator(value: any) {
    const validator = this.getValidatorFunction();
    if (!validator) return undefined;

    return validator(value, this.context.getData());
  }

  touch() {
    if (!this.context.skipValidation && !this.state.touched) this.setState({ touched: true });
  }

  /*
   * Dispatchers
   */

  dispatchFocus(event: Event) {
    if (this.props.onFocus) this.props.onFocus(event);
  }

  dispatchChange(event: Event) {
    this.target = (event || {}).target || this.target;
    const target: any = this.target || {};

    const value = this.value || target.value;
    this.context.onChange(this.props.name, value);
    if (this.props.onChange) this.props.onChange(event, value, this.error);
  }

  /*
   * Handlers
   */

  handleMount = (target: ?any, error: ?any) => {
    this.target = target;
    this.error = error;
    this.validate();
    if (this.context.touchOnMount) this.touch();
  };

  handleFocus = (event: Event) => {
    this.target = event.target || this.target;
    this.dispatchFocus(event);
    this.touch();
  };

  handleChange = (event: Event, value: any, error: ?any) => {
    this.value = value;
    this.error = error;

    this.validate();
    this.dispatchChange(event);
  };

  /*
   * Builders
   */

  buildValueProps() {
    if (typeof this.props.value === "undefined") {
      const contextObjectValue = this.getContextObjectValue();

      if (this.context.controlled) {
        const value = typeof contextObjectValue !== "undefined" ? contextObjectValue : "";
        return { value };
      }

      if (!this.props.defaultValue) {
        return { defaultValue: contextObjectValue };
      }
    }

    // The  `value` prop will be present on `...this.props`
    return {};
  }

  buildStatusProps() {
    return {
      error: this.props.error || this.state.error,
      touched: this.state.touched
    };
  }

  buildProps() {
    const props = {
      ...this.getSchemaProperty(),
      ...this.props,
      name: this.getPrefixedName(),
      onMount: this.handleMount,
      onFocus: this.handleFocus,
      onChange: this.handleChange,
      ...this.buildValueProps(),
      ...this.buildStatusProps()
    };

    delete props.validator;
    delete props.observe;

    return props;
  }

  /*
  * Lifecycle
  */

  componentWillMount() {
    const observe = this.props.observe || this.getSchemaProperty().observe;
    this.context.mountObserver(this.props.name, {
      fields: observe,
      fn: this.validate,
      selfFn: () => {
        if (this.context.controlled && !this.context.autoRendering) this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.context.unmountObserver(this.props.name);
  }

  /*
   * Render
   */

  render() {
    let component = this.getComponent();
    return React.createElement(component, this.buildProps());
  }
}
