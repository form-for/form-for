// @flow

import * as React from 'react';

import InlineField, { type Props as InlineFieldProps } from './InlineField';
import ConnectedField, { type Props as ConnectedFieldProps } from './ConnectedField';

import { FieldNameContext } from '../contexts';
import FieldMutator from './FieldMutator';
import FieldMap from './FieldMap';

export type Props = InlineFieldProps | ConnectedFieldProps;

export class FieldComponent extends React.Component<Props> {
  static inlineFieldComponent = InlineField;
  static connectedFieldComponent = ConnectedField;

  render() {
    const C = this.props.children ? this.constructor.inlineFieldComponent : this.constructor.connectedFieldComponent;

    return (
      <FieldNameContext.Provider value={this.props.name}>
        <C {...this.props} />
      </FieldNameContext.Provider>
    );
  }
}

export function withFieldStatics(
  Component: typeof FieldComponent,
  MutatorComponent: typeof FieldMutator,
  MapComponent: typeof FieldMap
) {
  // $FlowFixMe
  return class extends Component<Props> {
    static Name = FieldNameContext.Consumer;

    static Map = MapComponent;
    static Mutator = MutatorComponent;

    static Insert = MutatorComponent.create('insert');
    static Move = MutatorComponent.create('move');
    static Pop = MutatorComponent.create('pop');
    static Push = MutatorComponent.create('push');
    static Remove = MutatorComponent.create('remove');
    static Shift = MutatorComponent.create('shift');
    static Swap = MutatorComponent.create('swap');
    static Unshift = MutatorComponent.create('unshift');
  };
}

export default withFieldStatics(FieldComponent, FieldMutator, FieldMap);
