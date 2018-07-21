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

export class FieldPopComponent extends React.Component<CombinedProps> {
  handlePop = () => {
    const { contextFor, contextOnChange } = this.props;

    const newValue = cloneObject(contextFor);
    if (Array.isArray(newValue)) {
      newValue.pop();
    } else {
      const lastKey = Object.keys(newValue).pop();
      delete newValue[lastKey];
    }

    contextOnChange(null, newValue);
  };

  render() {
    const { children } = this.props;
    return children(this.handlePop);
  }
}

export function withFieldPopContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextOnChange={fieldGroupContext.onChange} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldPopContext(FieldPopComponent);
