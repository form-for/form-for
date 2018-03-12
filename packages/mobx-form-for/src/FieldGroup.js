// @flow

import { action } from 'mobx';
import { observer } from 'mobx-react';
import { FieldGroup as BaseFieldGroup } from 'form-for';

class FieldGroup extends BaseFieldGroup {
  onChange(name: string, value: any) {
    const mutator = () => (this.props.for[name] = value);

    action(`Update form value ${this.getPrefix()}`, mutator)();
    this.dispatchFormChange();
  }
}

export default observer(FieldGroup);
