// @flow

import * as React from 'react';
import { FieldMapContext } from '../contexts';
import { FieldGroupContext } from '../contexts';
import Mutator from '../helpers/Mutator';

type Props = {
  bound?: boolean,
  children: (method: Function) => Object
};

type ContextProps = {
  contextFor: Object,
  contextIndex: Number,
  contextOnChange: Function,
  contextMutator: typeof Mutator
};

type CombinedProps = Props &
  ContextProps & {
    methodName: string
  };

export class FieldMutatorComponent extends React.Component<CombinedProps> {
  handler = (...args: any[]) => {
    const { bound, contextFor, contextIndex, contextOnChange, contextMutator, methodName } = this.props;

    const mutator = new contextMutator(contextFor);
    if (bound || !args.length) args[0] = contextIndex;

    // $FlowFixMe
    const method = mutator[methodName].bind(mutator);
    if (!method) throw new Error(`Undefined mutator method ${methodName}`);

    method(...args);
    contextOnChange(null, mutator.for);
  };

  render() {
    return this.props.children(this.handler);
  }
}

export function withFieldMutatorContext(Component: React.ComponentType<*>) {
  return class extends React.Component<Props & { methodName: string }> {
    static create(methodName: string): (props: Props) => React.Node {
      const C = this;
      return (props: Props) => <C methodName={methodName} {...props} />;
    }

    render() {
      return (
        <FieldMapContext.Consumer>
          {fieldMapContext => (
            <FieldGroupContext.Consumer>
              {fieldGroupContext => (
                <Component
                  {...this.props}
                  contextFor={fieldMapContext.for || fieldGroupContext.for}
                  contextIndex={fieldMapContext.index}
                  contextOnChange={fieldMapContext.onChange || fieldGroupContext.onChange}
                  contextMutator={Mutator}
                />
              )}
            </FieldGroupContext.Consumer>
          )}
        </FieldMapContext.Consumer>
      );
    }
  };
}

export default withFieldMutatorContext(FieldMutatorComponent);
