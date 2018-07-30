// @flow

import { observer } from 'mobx-react';
import { withInlineFieldContext, InlineFieldComponent } from 'form-for';

export default withInlineFieldContext(observer(InlineFieldComponent));
