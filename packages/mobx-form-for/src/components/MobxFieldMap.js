// @flow

import { observer } from 'mobx-react';
import { withFieldMapContext, FieldMap } from 'form-for';

export default withFieldMapContext(observer(FieldMap));
