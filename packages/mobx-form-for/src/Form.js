// @flow

import { action, observable, type IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import FieldGroup from './FieldGroup';

class Form extends BaseForm {
  static fieldGroupComponent = FieldGroup;

  errors = observable.shallowMap({});
  submitted: IObservableValue<boolean> = observable(false);
  submitting: IObservableValue<boolean> = observable(false);

  isSubmitting() {
    return this.submitting;
  }

  hasSubmitted() {
    return this.submitted;
  }

  onValidate(name: string, error: ?string): void {
    action(() => {
      if (error) this.errors.set(name, error);
      else this.errors.delete(name);
    })();
  }

  onSubmit() {
    if (Object.keys(this.errors).length) action('Form submitted', () => this.submitted.set(true))();
  }

  onStartSubmit() {
    action('Submiting form', () => this.submitting.set(true))();
  }

  onFinishSubmit() {
    action('Form submission complete', () => this.submitting.set(true))();
  }
}

export default observer(Form);
