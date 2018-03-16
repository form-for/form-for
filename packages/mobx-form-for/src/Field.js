// @flow

import { observer } from 'mobx-react';
import { Field as BaseField } from 'form-for';

class Field extends BaseField {
  getShowErrorsState(): boolean {
    return this.context.showErrorsState.get();
  }
}

export default observer(Field);
