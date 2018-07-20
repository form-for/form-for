// @flow

import * as React from 'react';

import InlineField, { type Props as InlineFieldProps } from './InlineField';
import ConnectedField, { type Props as ConnectedFieldProps } from './ConnectedField';

import FieldInsert from './FieldInsert';
import FieldMap from './FieldMap';
import FieldMove from './FieldMove';
import FieldPop from './FieldPop';
import FieldPush from './FieldPush';
import FieldRemove from './FieldRemove';
import FieldShift from './FieldShift';
import FieldSwap from './FieldSwap';
import FieldUnshift from './FieldUnshift';

import { FieldNameContext } from '../contexts';

export type Props = InlineFieldProps | ConnectedFieldProps;

export default class Field extends React.Component<Props> {
  static Name = FieldNameContext.Consumer;

  static Insert = FieldInsert;
  static Map = FieldMap;
  static Move = FieldMove;
  static Pop = FieldPop;
  static Push = FieldPush;
  static Remove = FieldRemove;
  static Shift = FieldShift;
  static Swap = FieldSwap;
  static Unshift = FieldUnshift;

  render() {
    const { name, children } = this.props;
    const component = children ? <InlineField {...this.props} /> : <ConnectedField {...this.props} />;
    return <FieldNameContext.Provider value={name}>{component}</FieldNameContext.Provider>;
  }
}
