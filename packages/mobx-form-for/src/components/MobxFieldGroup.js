// @flow

import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { withFieldGroupContext, FieldGroupComponent } from 'form-for';

class FieldGroup extends FieldGroupComponent {
  getMutatedObject(name: ?string, value: any, index: ?any): Object {
    const key: any = name || index;
    if (this.props.for[key] !== value) {
      const mutator = () => (this.props.for[name] = value);
      runInAction(`Update form value ${this.getPrefix()}[${key}]`, mutator);
    }

    return this.props.for;
  }

  dispatchChange(newObject: Object) {
    this.dispatchFormChange();
  }
}

export default withFieldGroupContext(observer(FieldGroup));
