// @flow

import * as React from 'react';
import { Observer } from 'mobx-react';
import { BaseForm } from 'form-for';

type Props = {
  children: (value: T) => React.Node
};

export default (props: Props) => (
  <BaseForm.For>{data => <Observer render={() => props.children(data)} />}</BaseForm.For>
);
