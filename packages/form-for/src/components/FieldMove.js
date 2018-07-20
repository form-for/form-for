// @flow

import * as React from 'react';
import { FieldGroupContext } from '../contexts';
import cloneObject from '../helpers/cloneObject';

type Props = {
  children: (fromIndex: any, toIndex?: any) => React.Node
};

type CombinedProps = Props & {
  contextFor: Object,
  contextOnChange: Function
};

export class FieldMoveComponent extends React.Component<CombinedProps> {
  handleMove = (fromIndex: any, toIndex: any) => {
    const { contextFor, contextOnChange } = this.props;

    const newValue = cloneObject(contextFor);
    if (Array.isArray(newValue)) {
    } else {
    }

    contextOnChange(null, newValue);
  };

  render() {
    const { children } = this.props;
    return children(this.handleMove);
  }
}

export function withFieldMoveContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextOnChange={fieldGroupContext.onChange} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldMoveContext(FieldMoveComponent);
