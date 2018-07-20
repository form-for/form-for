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

export class FieldUnshiftComponent extends React.Component<CombinedProps> {
  handleUnshift = (value: any) => {
    const { contextFor, contextOnChange } = this.props;

    const newValue = cloneObject(contextFor);
    if (Array.isArray(newValue)) {
    } else {
    }

    contextOnChange(null, newValue);
  };

  render() {
    const { children } = this.props;
    return children(this.handleUnshift);
  }
}

export function withFieldUnshiftContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextOnChange={fieldGroupContext.onChange} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldUnshiftContext(FieldUnshiftComponent);
