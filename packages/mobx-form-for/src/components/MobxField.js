// @flow

import { observer } from 'mobx-react';
import { withFieldStatics, FieldComponent } from 'form-for';

import MobxFieldMutator from './MobxFieldMutator';
import MobxInlineField from './MobxInlineField';
import MobxConnectedField from './MobxConnectedField';
import MobxFieldMap from './MobxFieldMap';

class MobxFieldComponent extends FieldComponent {
  static inlineFieldComponent = MobxInlineField;
  static connectedFieldComponent = MobxConnectedField;
}

export default withFieldStatics(observer(MobxFieldComponent), MobxFieldMutator, MobxFieldMap);
