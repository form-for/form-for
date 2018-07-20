// @flow

import * as React from 'react';
import { FieldGroupContext } from '../contexts';
import cloneObject from '../helpers/cloneObject';
import FieldGroup from './FieldGroup';

type Props = {
  children: React.Node | ((value: any, index: any) => React.Node)
};

type CombinedProps = Props & {
  contextFor: Object
};

export class FieldMapComponent extends React.Component<CombinedProps> {
  render() {
    const { contextFor, children } = this.props;
    const renderFunction: any = typeof children === 'function' ? this.renderChildrenFunction : this.renderChildrenNode;

    return Object.keys(contextFor).map(index => {
      const value = contextFor[index];
      return (
        <FieldGroup for={value} index={index} key={index} contextName={null}>
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
      {fieldGroupContext => <Component {...props} contextFor={fieldGroupContext.for} />}
    </FieldGroupContext.Consumer>
  );
}

export default withFieldMapContext(FieldMapComponent);
