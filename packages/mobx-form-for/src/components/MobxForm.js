// @flow

import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import MobxFieldGroup from './MobxFieldGroup';

class MobxForm extends BaseForm {
  static fieldGroupComponent = MobxFieldGroup;
}

export default observer(MobxForm);
