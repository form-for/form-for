// @flow

import * as React from 'react';
import { FieldGroupContext } from '../contexts';
import cloneObject from '../helpers/cloneObject';
import FieldGroup from './FieldGroup';

type Props = {
  keyProp?: string,
  children: React.Node | ((value: any, index: any) => React.Node)
};

type CombinedProps = Props & {
  contextFor: Object,
  contextSchema: Object
};

export class FieldMapComponent extends React.Component<CombinedProps> {
  render() {
    const { keyProp, children, contextFor, contextSchema } = this.props;
    const renderFunction: any = typeof children === 'function' ? this.renderChildrenFunction : this.renderChildrenNode;

    return Object.keys(contextFor).map(index => {
      const value = contextFor[index];
      const key = keyProp ? value[keyProp] : index;

      return (
        <FieldGroup for={value} index={index} key={key} contextName={null} schema={value.schema || contextSchema}>
          {renderFunction(value, index)}
        </FieldGroup>
      );
    });
  }

  renderChildrenFunction = (value: any, index: any) => {
    // $FlowFixMe
    return this.props.children(value, index);
  };

  renderChildrenNode = () => {
    return React.createElement(
      React.Fragment,
      {},
      React.Children.map(this.props.children, child => React.cloneElement(child))
    );
  };
}

export function withFieldMapContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroupContext.Consumer>
      {fieldGroupContext => (
        <Component {...props} contextFor={fieldGroupContext.for} contextSchema={fieldGroupContext.schema} />
      )}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldMapContext(FieldMapComponent);
