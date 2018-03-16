// @flow

import { action, observable, type IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import FieldGroup from './FieldGroup';

class Form extends BaseForm {
  static fieldGroupComponent = FieldGroup;

  // $FlowFixMe
  errors = observable.shallowMap({});
  showErrors: IObservableValue<boolean> = observable(false);
  submitting: IObservableValue<boolean> = observable(false);

  isInvalid() {
    return !!this.errors.size;
  }

  isSubmitting() {
    return this.submitting;
  }

  getShowErrorsState() {
    return this.showErrors;
  }

  onValidate(name: string, error: ?string): void {
    action(() => {
      if (error) this.errors.set(name, error);
      else this.errors.delete(name);
    })();
  }

  dispatchShowErrors() {
    if (Object.keys(this.errors).length) action('Show form errors', () => this.showErrors.set(true))();
  }

  onStartSubmit() {
    action('Submiting form', () => this.submitting.set(true))();
  }

  onFinishSubmit() {
    action('Form submission complete', () => this.submitting.set(true))();
  }
}

export default observer(Form);
