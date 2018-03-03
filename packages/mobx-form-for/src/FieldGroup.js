// @flow

import { action } from 'mobx';
import { observer } from 'mobx-react';
import { FieldGroup as BaseFieldGroup } from 'form-for';

class FieldGroup extends BaseFieldGroup {
  onChange(name: string, value: any, index?: any) {
    const object = this.props.for;

    const mutator = () => {
      if (typeof index !== 'undefined') {
        object[name][index] = value;
      } else {
        object[name] = value;
      }
    };

    action(`Update form value ${this.getPrefix()}`, mutator)();
    this.forceUpdate();
    this.dispatchChange(object);
  }

  render() {
    return this.props.children;
  }
}

export default observer(FieldGroup);
