// @flow

import * as React from 'react';

import InlineField, { type Props as InlineFieldProps } from './InlineField';
import ConnectedField, { type Props as ConnectedFieldProps } from './ConnectedField';

import { FieldNameContext } from '../contexts';
import FieldMutator from './FieldMutator';
import FieldMap from './FieldMap';

export type Props = InlineFieldProps | ConnectedFieldProps;

export class FieldComponent extends React.Component<Props> {
  render() {
    const { name, children } = this.props;
    const component = children ? <InlineField {...this.props} /> : <ConnectedField {...this.props} />;
    return <FieldNameContext.Provider value={name}>{component}</FieldNameContext.Provider>;
  }
}

export function withFieldStatics(Component: typeof FieldComponent, Mutator: typeof FieldMutator) {
  return class extends Component {
    static Name = FieldNameContext.Consumer;

    static Map = FieldMap;
    static Mutator = Mutator;

    static Insert = Mutator.create('insert');
    static Move = Mutator.create('move');
    static Pop = Mutator.create('pop');
    static Push = Mutator.create('push');
    static Remove = Mutator.create('remove');
    static Shift = Mutator.create('shift');
    static Swap = Mutator.create('swap');
    static Unshift = Mutator.create('unshift');
  };
}

export default withFieldStatics(FieldComponent, FieldMutator);
