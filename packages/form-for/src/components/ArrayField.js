// @flow

import * as React from 'react';

import FieldGroup from './FieldGroup';
import { type ComponentProps } from '../types';
import { FieldGroupContext, ArrayFieldContext, ArrayFieldHelpersContext } from '../contexts';

export type Props = {
  name?: string,
  children: () => React.Node
};

type CombinedProps = ComponentProps &
  Props & {
    contextName?: string,
    contextFor: Object,
    contextOnChange: Function
  };

export class ArrayField extends React.Component<CombinedProps> {
  static Consumer = ArrayFieldContext.Consumer;
  static Helpers = ArrayFieldHelpersContext.Consumer;

  insert = (index: number, item: any) => {
    // this.props.onChange(null, values);
  };

  move = (fromIndex: any, toIndex: any) => {};

  remove = (fromIndex: number) => {};

  push = (item: any) => {};

  pop = () => {};

  shift = () => {};

  unshift = (item: any) => {};

  swap = (indexA: any, indexB: any) => {};

  getHelperProps() {
    return {
      insert: this.insert,
      move: this.move,
      remove: this.remove,
      push: this.push,
      pop: this.pop,
      shift: this.shift,
      unshift: this.unshift,
      swap: this.swap
    };
  }

  getHelpers() {}

  render() {
    const { value, children } = this.props;

    return Object.keys(value).map(key => {
      const item = value[key];

      return (
        <FieldGroup key={item.uid} for={item} index={key}>
          <ArrayFieldHelpersContext.Provider value={this.getHelperProps()}>
            {children}
          </ArrayFieldHelpersContext.Provider>
        </FieldGroup>
      );
    });
  }
}

export default ArrayField;
