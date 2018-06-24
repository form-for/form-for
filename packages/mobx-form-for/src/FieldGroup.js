// @flow

import { action } from 'mobx';
import { observer } from 'mobx-react';
import { FieldGroup as BaseFieldGroup } from 'form-for';

class FieldGroup extends BaseFieldGroup {
  getMutatedObject(name: string, value: any): Object {
    if (this.props.for[name] !== value) {
      const mutator = () => (this.props.for[name] = value);
      action(`Update form value ${this.getPrefix()}[${name}]`, mutator)();
    }

    return this.props.for;
  }

  dispatchChange(newObject: Object) {
    this.dispatchFormChange();
  }
}

export default observer(FieldGroup);
