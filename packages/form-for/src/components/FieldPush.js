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

export class FieldPushComponent extends React.Component<CombinedProps> {
  handlePush = (value: any) => {
    const { contextFor, contextOnChange } = this.props;
    contextOnChange(null, [...contextFor, value]);
  };

  render() {
    const { children } = this.props;
    return children(this.handlePush);
  }
}

export function withFieldPushContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextOnChange={fieldGroupContext.onChange} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldPushContext(FieldPushComponent);
