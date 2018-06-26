// @flow

import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import FieldGroup from './FieldGroup';

class Form extends BaseForm {
  static fieldGroupComponent = FieldGroup;
}

export default observer(Form);
