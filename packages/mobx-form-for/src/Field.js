// @flow

import { observer } from 'mobx-react';
import { withFieldContext, FieldComponent } from 'form-for';

export default withFieldContext(observer(FieldComponent));
