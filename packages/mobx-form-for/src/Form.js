// @flow

import { action, observable, type IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import FieldGroup from './FieldGroup';

class Form extends BaseForm {
  static fieldGroupComponent = FieldGroup;

  // static Errors = observer(BaseForm.Errors);
  // static Submit = observer(BaseForm.Submit);
}

export default observer(Form);
