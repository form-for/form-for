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

export class FieldShiftComponent extends React.Component<CombinedProps> {
  handleShift = () => {
    const { contextFor, contextOnChange } = this.props;

    const newValue = cloneObject(contextFor);
    if (Array.isArray(newValue)) {
      newValue.shift();
    } else {
      const firstKey = Object.keys(newValue).shift();
      delete newValue[firstKey];
    }

    contextOnChange(null, newValue);
  };

  render() {
    const { children } = this.props;
    return children(this.handleShift);
  }
}

export function withFieldShiftContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextOnChange={fieldGroupContext.onChange} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldShiftContext(FieldShiftComponent);
