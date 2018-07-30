// @flow

import { observer } from 'mobx-react';
import { withConnectedFieldContext, ConnectedFieldComponent } from 'form-for';

export default withConnectedFieldContext(observer(ConnectedFieldComponent));
