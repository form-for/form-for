// @flow

import { isObservableProp, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { withFieldGroupContext, FieldGroupComponent } from 'form-for';

class MobxFieldGroupComponent extends FieldGroupComponent {
  getMutatedObject(name: ?string, value: any, index: ?any): Object {
    const key: any = name || index;

    if (this.props.for[key] !== value) {
      const descriptionKey = `${this.getPrefix()}[${key}]`;
      if (!isObservableProp(this.props.for, name)) this.warnNotObservable(descriptionKey);

      const mutator = () => (this.props.for[name] = value);
      runInAction(`Update form value ${descriptionKey} to ${value}`, mutator);
    }

    return this.props.for;
  }

  dispatchChange(newObject: Object) {
    this.dispatchFormChange(newObject);
  }

  warnNotObservable(descriptionKey: string) {
    console.warn(`[MobX Form-for] Updating non observable ${descriptionKey} property`);
  }
}

export default withFieldGroupContext(observer(MobxFieldGroupComponent));
