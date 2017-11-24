// @flow

import * as React from "react";

import PropTypes from "prop-types";
import type { SchemaProperty } from "./FieldGroup";

export type ComponentProps = {
  type: string,
  name: string,
  error: ?string,
  touched: boolean,
  onMount: Function,
  onFocus: Function,
  onChange: Function,
  onBlur: Function,
  value?: any,
  defaultValue?: any
};

type EventProps = {
  value?: any,
  error?: ?string
};

export type Props = {
  name: string,
  type?: string,
  onFocus?: Function,
  onChange?: Function,
  onBlur?: Function,
  onValid?: Function,
  onInvalid?: Function,
  validator?: Function,
  error?: ?string,
  observe?: boolean | string | string[]
};

type State = {
  error: ?string,
  touched: boolean
};

export default class Field extends React.Component<Props, State> {
  target: ?any;
  state = { error: undefined, touched: false };
  dispatchValidationOnUpdate: boolean = false;

  /*
   * Component binding
   */

  static componentBindings: { [_: string]: React.ComponentType<*> } = {};

  static bindComponent(type: string, component: React.ComponentType<*>): void {
    Field.componentBindings[type] = component;
  }

  /*
   * Context
   */

  static contextTypes = {
    object: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    prefix: PropTypes.string.isRequired,
    getValues: PropTypes.func.isRequired,
    controlled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.arrayOf(PropTypes.string).isRequired,
    onValid: PropTypes.func.isRequired,
    onInvalid: PropTypes.func.isRequired,
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
      return `${this.context.prefix}[${this.props.name}]`;
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

  hasValidationType(name: string): boolean {
    return this.context.validate.includes(name);
  }

  isValidationDisabled(): boolean {
    return !this.context.validate.length;
  }

  hasValidationTypeMounting(type: string): boolean {
    if (this.isValidationDisabled()) return false;
    return type === "mount" || this.hasValidationType(type);
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

  validate(type: string, props: EventProps) {
    this.validateTarget(this.target, type, props);
  }

  validateTarget(target: any, type: string, props: EventProps): void {
    if (!this.hasValidationTypeMounting(type)) return;
    this.clearBrowserCustomValidity();

    target = target || {};
    const value = props.value || target.value;

    let error;
    if (this.props.error) {
      error = this.props.error;
    } else {
      const validatorResponse = this.validator(value);
      error = validatorResponse || props.error || target.validationMessage;
    }

    this.setBrowserCustomValidity(error);
    this.dispatchValidation(value, error);

    if (this.hasValidationType(type)) this.setState({ error: error, touched: true });
  }

  validator(value: any) {
    const validator = this.getValidatorFunction();
    if (!validator) return undefined;

    return validator(value, this.context.getValues());
  }

  /*
   * Dispatchers
   */

  dispatchValidation(value: any, error: ?string) {
    if (error) {
      this.dispatchValidationError(value, error);
    } else {
      this.dispatchValidationSuccess(value);
    }
  }

  dispatchValidationSuccess(value: any) {
    this.context.onValid(this.props.name, value);
    if (this.props.onValid) this.props.onValid(value);
  }

  dispatchValidationError(value: any, error: ?string) {
    this.context.onInvalid(this.props.name, value, error);
    if (this.props.onInvalid) this.props.onInvalid(value, error);
  }

  dispatchFocus(event: Event) {
    if (this.props.onFocus) this.props.onFocus(event);
  }

  dispatchChange(event: Event, value: any) {
    this.context.onChange(this.props.name, value);
    if (this.props.onChange) this.props.onChange(event);
  }

  dispatchBlur(event: Event) {
    if (this.props.onBlur) this.props.onBlur(event);
  }

  /*
   * Handlers
   */

  handleMount(target: ?any, { value, error }: EventProps = {}) {
    this.target = target;
    this.validate("mount", { value, error });
  }

  handleFocus(event: Event, props: EventProps = {}) {
    this.target = event.target || this.target;
    this.validate("focus", props);
    this.dispatchFocus(event);
  }

  handleChange(event: Event, props: EventProps = {}) {
    this.target = event.target || this.target;
    this.validate("change", props);
    this.dispatchChange(event, props.value || (this.target || {}).value);
  }

  handleBlur(event: Event, props: EventProps = {}) {
    this.target = event.target || this.target;
    this.validate("blur", props);
    this.dispatchBlur(event);
  }

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
      onMount: this.handleMount.bind(this),
      onFocus: this.handleFocus.bind(this),
      onChange: this.handleChange.bind(this),
      onBlur: this.handleBlur.bind(this),
      ...this.buildValueProps(),
      ...this.buildStatusProps()
    };

    delete props.validator;
    delete props.onValid;
    delete props.onInvalid;
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
      fn: this.validate.bind(this)
    });
  }

  componentWillUnmount() {
    this.context.unmountObserver(this.props.name);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.error !== this.props.error) {
      this.dispatchValidationOnUpdate = true;
    }
  }

  componentDidUpdate() {
    if (this.dispatchValidationOnUpdate) {
      this.dispatchValidationOnUpdate = false;
      this.validate("change", { value: this.getContextObjectValue() });
    }
  }

  /*
   * Render
   */

  render() {
    let component = this.getComponent();
    return React.createElement(component, this.buildProps());
  }
}
