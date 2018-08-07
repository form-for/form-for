// @flow

import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import MobxFieldGroup from './MobxFieldGroup';
import MobxFormFor from './MobxFormFor';

class MobxForm extends BaseForm {
  static fieldGroupComponent = MobxFieldGroup;
  static For = MobxFormFor;
}

export default observer(MobxForm);
