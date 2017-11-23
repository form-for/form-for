// @flow

import * as React from "react";

import PropTypes from "prop-types";
import type { SchemaProperty } from "./FieldGroup";
import { isPromise } from "./helpers";

export type ComponentProps = {
  type: string,
  name: string,
  error: ?string,
  onMount: Function,
  onFocus: Function,
  onChange: Function,
  onBlur: Function,
  value?: any,
  defaultValue?: any,
  waiting?: boolean
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
  waiting: boolean
};

export default class Field extends React.Component<Props, State> {
  target: ?any;
  state = { error: undefined, waiting: false };
  dispatchValidationOnUpdate: boolean = false;
  waitingPromise: ?Promise;

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
   * Dispatchers
   */

  dispatchBrowserValidation(type: string, message: string) {
    const target = this.target;
    if (!target) return;

    if (Array.isArray(target)) {
      return target.forEach(el => {
        this.dispatchValidationForTarget(el, type, { error: message });
      });
    }

    if (target.setCustomValidity) {
      target.setCustomValidity(message);
    }
  }

  dispatchValidation(type: string, props: EventProps) {
    this.dispatchValidationForTarget(this.target, type, props);
  }

  async dispatchValidationForTarget(target: any, type: string, { value, error }: EventProps): Promise<void> {
    if (!this.context.validate.length || (type !== "mount" && !this.hasValidationType(type))) {
      return;
    }

    this.dispatchBrowserValidation(type, "");

    if (this.props.error) {
      error = this.props.error;
    } else {
      value = this.guessTargetProperty(target, value, "value");

      try {
        const validationMessage = await this.dispatchValidator(target, type, value);
        error = this.guessTargetProperty(target, validationMessage || error, "validationMessage");
      } catch (exception) {
        if (!exception) return;
        error = exception;
      }
    }

    this.dispatchError(type, { value, error });
  }

  async dispatchValidator(target: any, type: string, value: any) {
    const validator = this.getValidator();
    if (!validator) return undefined;

    const validatorResponse = validator(value, this.context.getValues(), {
      type,
      target,
      validationMessage: this.guessTargetProperty(target, undefined, "validationMessage")
    });

    if (isPromise(validatorResponse)) {
      this.setState({ waiting: true });
      this.dispatchError(type, { value: value, error: "⌛" });

      let error;
      try {
        this.waitingPromise = validatorResponse;
        await validatorResponse;
      } catch (exception) {
        error = exception;
      }

      if (this.waitingPromise !== validatorResponse) throw undefined;

      this.dispatchBrowserValidation(type, "");
      this.setState({ waiting: false });
      this.waitingPromise = undefined;

      if (error) throw error;
    } else {
      this.waitingPromise = null;
      return validatorResponse;
    }
  }

  dispatchError(type: string, { value, error }: EventProps) {
    this.dispatchBrowserValidation(type, error || "");

    if (error) {
      this.context.onInvalid(this.props.name, value, error);
      if (this.props.onInvalid) this.props.onInvalid(value, error);
    } else if (!error) {
      this.context.onValid(this.props.name, value);
      if (this.props.onValid) this.props.onValid(value);
    }

    if (this.hasValidationType(type) && error !== this.state.error) {
      this.setState({ error });
    }
  }

  /*
   * Guessers
   */

  guessTargetProperty(target: any, value: ?any, name: string): ?any {
    if (value) return value;

    if (target) {
      if (Array.isArray(target)) {
        return target[0][name];
      }

      return target[name];
    }
  }

  /*
   * Handlers
   */

  handleMount(target: ?any, { value, error }: EventProps = {}) {
    this.target = target;
    this.dispatchValidation("mount", { value, error });
  }

  handleFocus(event: Event, props: EventProps = {}) {
    this.target = event.target || this.target;
    this.dispatchValidation("focus", props);

    if (this.props.onFocus) this.props.onFocus(event);
  }

  handleChange(event: Event, props: EventProps = {}) {
    this.target = event.target || this.target;
    this.dispatchValidation("change", props);

    const value = this.guessTargetProperty(this.target, props.value, "value");
    this.context.onChange(this.props.name, value);
    if (this.props.onChange) this.props.onChange(event);
  }

  handleBlur(event: Event, props: EventProps = {}) {
    this.target = event.target || this.target;
    this.dispatchValidation("blur", props);

    if (this.props.onBlur) this.props.onBlur(event);
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

  getValidator() {
    if (this.props.validator) return this.props.validator;

    const validator = this.getSchemaProperty().validator;

    if (typeof validator === "string") {
      return this.context.object[validator].bind(validator);
    }

    return validator;
  }

  hasValidationType(name: string) {
    return this.context.validate.includes(name);
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

  buildErrorProps() {
    const error = this.props.error || this.state.error;
    return error ? { error } : {};
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
      ...this.buildErrorProps()
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
      dispatcher: this.dispatchValidation.bind(this)
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
      this.dispatchValidation("change", { value: this.getContextObjectValue() });
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
