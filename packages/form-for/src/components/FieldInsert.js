// @flow

import * as React from 'react';
import cloneObject from '../helpers/cloneObject';
import { FieldGroupContext } from '../contexts';

type Props = {
  children: (index: any, value: any) => React.Node
};

type CombinedProps = Props & {
  contextFor: Object,
  contextOnChange: Function
};

export class FieldInsertComponent extends React.Component<CombinedProps> {
  handleInsert = (index: any, value: any) => {
    const { contextFor, contextOnChange } = this.props;

    const newValue = cloneObject(contextFor);
    if (Array.isArray(newValue)) {
      newValue.splice(index, 0, value);
    } else {
      newValue[index] = value;
    }

    contextOnChange(null, newValue);
  };

  render() {
    const { children } = this.props;
    return children(this.handleInsert);
  }
}

export function withFieldInsertContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextOnChange={fieldGroupContext.onChange} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldInsertContext(FieldInsertComponent);
