// @flow

import { isObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { BaseForm } from 'form-for';
import MobxFieldGroup from './MobxFieldGroup';
import MobxFormFor from './MobxFormFor';

class MobxForm extends BaseForm {
  static fieldGroupComponent = MobxFieldGroup;
  static For = MobxFormFor;

  render() {
    if (this.props.for && !isObservable(this.props.for)) this.warnNotObservable();
    return super.render();
  }

  warnNotObservable() {
    console.warn('[MobX Form-for] Object given to the form is not a MobX observable');
  }
}

export default observer(MobxForm);
