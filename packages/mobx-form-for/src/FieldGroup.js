// @flow

import { action } from 'mobx';
import { observer } from 'mobx-react';
import { FieldGroup as BaseFieldGroup } from 'form-for';

class FieldGroup extends BaseFieldGroup {
  onChange(name: string, value: any) {
    const object = this.props.for;

    if (object[name] !== value) {
      const mutator = () => (object[name] = value);
      action(`Update form value ${this.getPrefix()}[${name}]`, mutator)();
    }

    this.dispatchFormChange();
  }
}

export default observer(FieldGroup);
