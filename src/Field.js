// @flow

import * as React from "react";

import PropTypes from "prop-types";
import type { SchemaProperty } from "./FieldGroup";

type EventProperties = {
  value?: any,
  error?: ?string
};

export type Props = {
  name: string,
  type?: string,
  onChange?: Function,
  onValid?: Function,
  onInvalid?: Function,
  validator?: Function, // must work with promise
  error?: string,
  [key: string]: any
};

type State = {
  error: ?string
};

export default class Field extends React.Component<Props, State> {
  component: HTMLElement;
  state = { error: undefined };

  /*
   * Component binding
   */

  static componentBindings: { [_: string]: React.ComponentType<*> } = {};

  static bindComponent(type: string, component: React.ComponentType<*>): void {
    this.componentBindings[type] = component;
  }

  /*
   * Context
   */

  static contextTypes = {
    object: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.arrayOf(PropTypes.string)
  };

  static childContextTypes = {
    prefix: PropTypes.string
  };

  getChildContext() {
    return {
      prefix: this.getPrefixedName()
    };
  }

  /*
   * Dispatchers
   */

  dispatchBrowserValidation(target: any, message: string) {
    if (!target) return;

    if (Array.isArray(target)) {
      return target.forEach(el => {
        this.dispatchValidation(el, message);
      });
    }

    if (target.setCustomValidity) {
      target.setCustomValidity(message);
    }
  }

  dispatchValidation(event: any, type: string, value: ?any, error: ?string) {
    if (this.props.error) return;

    // $FlowFixMe
    const target: any = (event || {}).target;
    value = this.guessEventTargetProperty(event, value, "value");

    const validator = this.getValidator();
    if (validator) {
      const validatorMessage = validator(value);

      if (validatorMessage) {
        error = validatorMessage;
      }

      this.dispatchBrowserValidation(target, validatorMessage || "");
    }

    error = this.guessEventTargetProperty(event, error, "validationMessage");

    if (this.hasValidationType(type)) {
      if (error !== this.state.error) {
        this.setState({ error });
      }

      if (error && this.props.onInvalid) {
        this.props.onInvalid(error, value);
      } else if (!error && this.props.onValid) {
        this.props.onValid(value);
      }
    }
  }

  dispatchContextChange(value: any) {
    if (!this.context.onChange) return;

    const mutator = () => {
      this.context.object[this.props.name] = value;
      return this.context.object;
    };

    this.context.onChange(mutator, this.getPrefixedName(), value);
  }

  dispatchPropsChange(event: Event) {
    if (!this.props.onChange) return;
    this.props.onChange(event);
  }

  /*
   * Guessers
   */
  guessEventTargetProperty(event: Event, value: ?any, name: string): ?any {
    if (typeof value !== "undefined") {
      return value;
    }

    if (event && event.target) {
      if (Array.isArray(event.target)) {
        return event.target[0][name];
      }

      // $FlowFixMe
      return event.target[name];
    }
  }

  /*
   * Handlers
   */

  handleMount(target: ?any, { value, error }: EventProperties = {}) {
    this.dispatchValidation({ target }, "mount", value, error);
  }

  handleFocus(event: Event, { value, error }: EventProperties = {}) {
    this.dispatchValidation(event, "focus", value, error);
  }

  handleChange(event: Event, { value, error }: EventProperties = {}) {
    if (this.hasValidationType("change")) {
      this.dispatchValidation(event, "change", value, error);
    }

    value = this.guessEventTargetProperty(event, value, "value");
    this.dispatchContextChange(value);
    this.dispatchPropsChange(event);
  }

  handleBlur(event: Event, { value, error }: EventProperties = {}) {
    this.dispatchValidation(event, "blur", value, error);
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
        `Undefined property ${this.props.name} in schema or inline type for
        ${this.context.object.constructor.name} instance`
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

  getValidator() {
    if (this.props.validator) return this.props.validator;

    const validator = this.getSchemaProperty().validator;

    if (typeof validator === "string") {
      return this.context.object[validator].bind(validator);
    }

    return validator;
  }

  hasValidationType(name: string) {
    return this.context.validate.indexOf(name) !== -1;
  }

  /*
   * Builders
   */

  buildValueProps() {
    if (typeof this.props.value === "undefined") {
      const contextObjectValue = this.getContextObjectValue();

      if (this.context.onChange) {
        const value = typeof contextObjectValue !== "undefined" ? contextObjectValue : "";
        return { value };
      }

      if (!this.props.defaultValue) {
        return { defaultValue: contextObjectValue };
      }
    }

    return {};
  }

  buildEventProps() {
    const onMount = this.context.validate.length > 0 ? this.handleMount.bind(this) : undefined;

    const onFocus = this.hasValidationType("focus") ? this.handleFocus.bind(this) : undefined;

    const hasOnChange = this.context.onChange || this.hasValidationType("change");
    const onChange = hasOnChange ? this.handleChange.bind(this) : undefined;

    const onBlur = this.hasValidationType("blur") ? this.handleBlur.bind(this) : undefined;

    return { onMount, onFocus, onChange, onBlur };
  }

  buildErrorProps() {
    const error = this.props.error || this.state.error;
    return error ? { error, "aria-invalid": true } : {};
  }

  buildProps() {
    const props = {
      ...this.getSchemaProperty(),
      ...this.props,
      name: this.getPrefixedName(),
      ...this.buildValueProps(),
      ...this.buildEventProps(),
      ...this.buildErrorProps()
    };

    delete props.validator;
    delete props.onValid;
    delete props.onInvalid;

    return props;
  }

  /*
   * Render
   */

  render() {
    let component = this.getComponent();
    return React.createElement(component, this.buildProps());
  }
}
